package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Document;

import java.util.List;
import java.util.Optional;

public interface DocumentsRepository extends JpaRepository<Document, String> {
    Optional<Document> findByName(String name);
    List<Document> findByOwnerUserId(Long userId);
}
