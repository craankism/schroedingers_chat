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
import sc.backend.exceptions.FileNotFoundException;
import sc.backend.exceptions.FileStorageException;
import sc.backend.exceptions.UserNotFoundException;
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
public class FileStorageService {

    private final MinioClient minioClient;
    private final UserRepository userRepository;
    private final StoredFileRepository storedFileRepository;
    private final FolderRepository folderRepository;
    private final CryptoUtil cryptoUtil;

    @Value("${minio.bucket.name}")
    private String bucketName;

    public StoredFileMetaDTO uploadFile(MultipartFile file, String userName, Integer folderId) {
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

        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new IllegalArgumentException("Folder not found: " + folderId));
        }

        StoredFile storedFile = StoredFile.builder()
                .filename(file.getOriginalFilename())
                .storedFilename(storedFileName)
                .size(file.getSize())
                .mimeType(file.getContentType())
                .uploadDate(LocalDateTime.now())
                .uploadedBy(userRepository.findByEmail(userName)
                        .orElseThrow(() -> new UserNotFoundException("User not found")))
                .folder(folder)
                .iv(iv)
                .encryptedDek(null)
                .build();

        return convertStoredFileToDto(storedFileRepository.save(storedFile));
    }

    public InputStream downloadFile(Integer fileId) {
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

    public List<StoredFileMetaDTO> getAllFilesMetaDate() {
        List<StoredFileMetaDTO> fileDtoList = new ArrayList<>();

        for (StoredFile file : storedFileRepository.findAll()) {
            fileDtoList.add(convertStoredFileToDto(file));
        }
        return fileDtoList;
    }

    public void deleteFile(Integer fileId) {
        StoredFile file = storedFileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + fileId));

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
                .folderId(storedFile.getFolder() != null ? storedFile.getFolder().getId() : null)
                .build();
    }

    public StoredFileMetaDTO getFileMetadataByFilename(String filename) {
        StoredFile file = storedFileRepository.findFirstByFilenameIgnoreCase(filename)
                .orElseThrow(() -> new FileNotFoundException("File " + filename + " not found"));

        return convertStoredFileToDto(file);
    }
}