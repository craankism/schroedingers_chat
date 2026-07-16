package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Folder;
import sc.backend.entities.StoredFile;

import java.util.List;

public interface StoredFileRepository extends JpaRepository<StoredFile, Integer> {
    List<StoredFile> findByFolder(Folder folder);
}
