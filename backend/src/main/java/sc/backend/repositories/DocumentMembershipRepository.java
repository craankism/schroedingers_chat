package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Document;
import sc.backend.entities.DocumentMembership;
import sc.backend.entities.User;

import java.util.List;
import java.util.Optional;

public interface DocumentMembershipRepository extends JpaRepository<DocumentMembership, Long> {
    Optional<DocumentMembership> findByDocumentAndUser(Document document, User user);
    List<DocumentMembership> findByUser(User user);
    List<DocumentMembership> findByDocument(Document document);
    boolean existsByDocumentAndUser(Document document, User user);
}
