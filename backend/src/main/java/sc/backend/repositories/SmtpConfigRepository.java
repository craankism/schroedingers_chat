package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.SmtpConfig;

public interface SmtpConfigRepository extends JpaRepository<SmtpConfig, Integer> {
}
