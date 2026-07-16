package sc.backend.services;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import sc.backend.components.CryptoUtil;
import sc.backend.dtos.res.StoredFileMetaDTO;
import sc.backend.entities.Folder;
import sc.backend.entities.StoredFile;
import sc.backend.entities.User;
import sc.backend.exceptions.FileNotFoundException;
import sc.backend.exceptions.FileStorageException;
import sc.backend.exceptions.UserNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import sc.backend.repositories.FolderRepository;
import sc.backend.repositories.StoredFileRepository;
import sc.backend.repositories.UserRepository;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Profile("prod")
@RequiredArgsConstructor
public class ProfilePictureService {

    private final MinioClient minioClient;
    private final UserRepository userRepository;
    private final StoredFileRepository storedFileRepository;
    private final FolderRepository folderRepository;
    private final CryptoUtil cryptoUtil;

    @Value("${minio.bucket.name.pp}")
    private String bucketName;

    public List<InputStream> downloadAllPictures() {
        List<StoredFile> storedFiles = storedFileRepository.findAll();
        List<InputStream> blobList = new ArrayList<>();
        for (StoredFile file : storedFiles) {
            InputStream encryptedStream;

            try {
                encryptedStream = minioClient.getObject(
                        GetObjectArgs.builder()
                                .bucket(bucketName)
                                .object(file.getStoredFilename())
                                .build());
            } catch (Exception e) {
                throw new FileStorageException("Failed to download File from Storage: " + file.getFileId(), e);
            }
            byte[] ciphertext;
            try {
                ciphertext = encryptedStream.readAllBytes();
            } catch (Exception e) {
                throw new FileStorageException("Failed to read encrypted stream for file: " + file.getFileId(), e);
            }

            byte[] decrypted = cryptoUtil.decrypt(ciphertext, file.getIv());

            blobList.add(new ByteArrayInputStream(decrypted));
        }

        return blobList;
    };

    public StoredFileMetaDTO uploadPicture(MultipartFile file, String userName) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File may not be empty");
        }

        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID() + extension;

        byte[] plaintext;
        try {
            plaintext = file.getBytes();
        } catch (Exception e) {
            throw new FileStorageException("Could not read File Bytes", e);
        }

        CryptoUtil.EncryptionResult encryptionResult = cryptoUtil.encrypt(plaintext);
        byte[] ciphertext = encryptionResult.ciphertext();
        byte[] iv = encryptionResult.iv();

        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(storedFileName)
                            .stream(new ByteArrayInputStream(ciphertext), (long) ciphertext.length, (long) -1)
                            .contentType("application/octet-stream")
                            .build());
        } catch (Exception e) {
            throw new FileStorageException("Failed to upload file to Storage", e);
        }

        StoredFile storedFile = StoredFile.builder()
                .filename(file.getOriginalFilename())
                .storedFilename(storedFileName)
                .size(file.getSize())
                .mimeType(file.getContentType())
                .uploadDate(LocalDateTime.now())
                .uploadedBy(userRepository.findByEmail(userName)
                        .orElseThrow(() -> new UserNotFoundException("User not found")))
                .iv(iv)
                .encryptedDek(null)
                .build();

        try {
            return convertStoredFileToDto(storedFileRepository.save(storedFile));
        } catch (Exception e) {
            try {
                minioClient.removeObject(
                        RemoveObjectArgs.builder()
                                .bucket(bucketName)
                                .object(storedFileName)
                                .build());
            } catch (Exception cleanupEx) {
                log.error("Failed to cleanup orphaned file: {}", storedFileName, cleanupEx);
            }
            throw new FileStorageException("Failed to save file metadata", e);
        }
    }

    public InputStream downloadPicture(Integer fileId) {
        StoredFile file = storedFileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + fileId));

        InputStream encryptedStream;
        try {
            encryptedStream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(file.getStoredFilename())
                            .build());
        } catch (Exception e) {
            throw new FileStorageException("Failed to download File from Storage: " + fileId, e);
        }

        byte[] ciphertext;
        try {
            ciphertext = encryptedStream.readAllBytes();
        } catch (Exception e) {
            throw new FileStorageException("Failed to read encrypted stream for file: " + fileId, e);
        }

        byte[] decrypted = cryptoUtil.decrypt(ciphertext, file.getIv());

        return new ByteArrayInputStream(decrypted);
    }

    public StoredFileMetaDTO getFileMetadata(Integer fileId) {
        return convertStoredFileToDto(storedFileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not Found" + fileId)));
    }

    public List<StoredFileMetaDTO> getAllFilesMetaData() {
        List<StoredFileMetaDTO> fileDtoList = new ArrayList<>();

        for (StoredFile file : storedFileRepository.findAll()) {
            fileDtoList.add(convertStoredFileToDto(file));
        }
        return fileDtoList;
    }

    public StoredFileMetaDTO moveFile(Integer fileId, Integer folderId) {
        StoredFile file = storedFileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + fileId));
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found: " + folderId));
        file.setFolder(folder);
        return convertStoredFileToDto(storedFileRepository.save(file));
    }

    public void deleteFile(Integer fileId, String userName) {
        StoredFile file = storedFileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + fileId));

        User caller = userRepository.findByEmail(userName)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (file.getUploadedBy().getUserId() != caller.getUserId() && !caller.isAdmin()) {
            throw new AccessDeniedException("You do not have permission to delete this file");
        }

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(file.getStoredFilename())
                            .build());
        } catch (Exception e) {
            throw new FileStorageException("Failed to delete file from Storage: " + fileId, e);
        }

        storedFileRepository.delete(file);
    }

    private StoredFileMetaDTO convertStoredFileToDto(StoredFile storedFile) {
        return StoredFileMetaDTO.builder()
                .fileId(storedFile.getFileId())
                .filename(storedFile.getFilename())
                .uploadedById(storedFile.getUploadedBy().getUserId())
                .size(storedFile.getSize())
                .uploadDate(storedFile.getUploadDate())
                .mimeType(storedFile.getMimeType())
                .build();
    }

    public StoredFileMetaDTO getFileMetadataByFilename(String filename) {
        StoredFile file = storedFileRepository.findFirstByFilenameIgnoreCase(filename)
                .orElseThrow(() -> new FileNotFoundException("File " + filename + " not found"));

        return convertStoredFileToDto(file);
    }
}