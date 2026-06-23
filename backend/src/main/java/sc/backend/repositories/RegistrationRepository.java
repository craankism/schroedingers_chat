package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.Registration;

import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Integer> {
    Optional<Registration> findByRegistrationCode(String email);
}
