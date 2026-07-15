package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Folder;
import sc.backend.entities.StoredFile;

import java.util.List;
import java.util.Optional;

public interface StoredFileRepository extends JpaRepository<StoredFile, Integer> {
    Optional<StoredFile> findFirstByFilenameIgnoreCase(String filename);

    List<StoredFile> findByFolder(Folder folder);
}
