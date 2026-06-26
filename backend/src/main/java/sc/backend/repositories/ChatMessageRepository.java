package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sc.backend.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
}
