package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Document;


public interface DocumentRepository extends JpaRepository<Document, Integer> {
}
