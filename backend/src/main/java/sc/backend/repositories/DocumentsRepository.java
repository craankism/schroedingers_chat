package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Documents;

public interface DocumentsRepository extends JpaRepository<Documents, String> {
}
