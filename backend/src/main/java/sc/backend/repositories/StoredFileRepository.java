package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.StoredFile;

public interface StoredFileRepository extends JpaRepository<StoredFile, Integer> {
}
