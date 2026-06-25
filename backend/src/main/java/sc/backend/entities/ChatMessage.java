package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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

    @Column(nullable = false)
    private String content;

    //TODO: best date type?
    @Column(nullable = false)
    private Date creationDate;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "roomId")
    private Room room;
}
