package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roomId;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User createdBy;

    @Builder.Default
    @ManyToMany(mappedBy = "roomList")
    private List<User> userList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "room")
    private List<ChatMessage> chatMessageList = new ArrayList<>();
}