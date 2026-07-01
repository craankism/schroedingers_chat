package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @ManyToMany
    @JoinTable(name = "room_member",
            joinColumns = @JoinColumn(name = "roomId"),
            inverseJoinColumns = @JoinColumn(name = "userId"))
    private Set<User> userList = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "room")
    private List<ChatMessage> chatMessageList = new ArrayList<>();
}