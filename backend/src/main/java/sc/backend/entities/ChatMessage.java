package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int messageId;

    //TODO: length?
    @Lob
    private String content;

    //TODO: best date type?
    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column(nullable = false)
    private String senderType;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "roomId")
    private Room room;

    @Column(nullable = false)
    private byte[] iv;
}
