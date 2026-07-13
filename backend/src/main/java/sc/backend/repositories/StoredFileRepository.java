package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.StoredFile;

import java.util.Optional;

public interface StoredFileRepository extends JpaRepository<StoredFile, Integer> {
    Optional<StoredFile> findFirstByFilenameIgnoreCase(String filename);
}
