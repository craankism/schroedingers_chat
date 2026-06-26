package sc.backend.services;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sc.backend.dtos.res.StoredFileDTO;
import sc.backend.entities.StoredFile;
import sc.backend.repositories.StoredFileRepository;
import sc.backend.repositories.UserRepository;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final MinioClient minioClient;
    private final UserRepository userRepository;
    private final StoredFileRepository storedFileRepository;

    @Value("${minio.bucket.name}")
    private String bucketName;

    /**
     * Upload: Datei direkt (unverschluesselt) nach MinIO streamen
     */
    public StoredFileDTO uploadFile(MultipartFile file, String userName) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Datei darf nicht leer sein");
        }

        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID() + extension;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(storedFileName)
                        .stream(file.getInputStream(), file.getSize(), (long) -1)
                        .contentType(file.getContentType())
                        .build()
        );

        StoredFile storedFile = StoredFile.builder()
                .filename(file.getOriginalFilename())
                .storedFilename(storedFileName)
                .size(file.getSize())
                .mimeType(file.getContentType())
                .uploadDate(LocalDateTime.now())
                .uploadedBy(userRepository.findByEmail(userName).orElseThrow(() -> new RuntimeException("User nicht gefunden")))
                .build();

        return convertStoredFileToDto(storedFileRepository.save(storedFile));
    }

    /**
     * Download: Datei direkt aus MinIO streamen
     */
    public InputStream downloadFile(Integer fileId) throws Exception {
        StoredFile file = storedFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Datei nicht gefunden"));

        return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(file.getStoredFilename())
                        .build()
        );
    }

    /**
     * Metadaten abrufen (fuer Dateiliste im Frontend)
     */
    public StoredFileDTO getFileMetadata(Integer fileId) {
        return convertStoredFileToDto(storedFileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("Datei nicht gefunden")));
    }

    private StoredFileDTO convertStoredFileToDto(StoredFile storedFile) {
        return StoredFileDTO.builder()
                .fileId(storedFile.getFileId())
                .filename(storedFile.getFilename())
                .uploadedById(storedFile.getUploadedBy().getUserId())
                .size(storedFile.getSize())
                .uploadDate(storedFile.getUploadDate())
                .build();
    }
}