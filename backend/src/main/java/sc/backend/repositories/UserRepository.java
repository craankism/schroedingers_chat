package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
