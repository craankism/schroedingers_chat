package sc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sc.backend.entities.ChatMessage;
import sc.backend.entities.Room;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    @Query("SELECT m FROM ChatMessage m WHERE m.room = :room ORDER BY m.messageId DESC LIMIT 50 OFFSET :offset")
    List<ChatMessage> findAllByRoom(@Param("room") Room room, @Param("offset") int offset);

    @Query("""
            SELECT m
            FROM ChatMessage m
            WHERE m.room.roomId = :roomId
              AND m.messageId < :currentMessageId
              AND m.senderType = 'USER'
              AND m.aiPrompt = true
            ORDER BY m.messageId DESC
            LIMIT 10
            """)
    List<ChatMessage> findRecentAiPrompts(
            @Param("roomId") int roomId,
            @Param("currentMessageId") int currentMessageId
    );

    @Query("""
            SELECT m
            FROM ChatMessage m
            WHERE m.room.roomId = :roomId
              AND m.senderType = 'AI'
              AND m.aiPromptMessageId IN :promptIds
            ORDER BY m.messageId ASC
            """)
    List<ChatMessage> findAiAnswersForPrompts(
            @Param("roomId") int roomId,
            @Param("promptIds") List<Integer> promptIds
    );
}
