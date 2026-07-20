package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Folder;
import sc.backend.entities.StoredFile;

import java.util.List;
import java.util.Optional;

public interface StoredFileRepository extends JpaRepository<StoredFile, Integer> {
    Optional<StoredFile> findFirstByFilenameIgnoreCaseAndBucketName(String filename, String bucketName);

    List<StoredFile> findByFolder(Folder folder);

    Optional<StoredFile> findByFileIdAndBucketName(Integer fileId, String bucketName);

    List<StoredFile> findAllByBucketName(String bucketName);
}
