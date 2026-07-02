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
            inverseJoinColumns = @JoinColumn(name = "userId"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"roomId", "userId"}))
    private Set<User> userSet = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ChatMessage> chatMessageList = new ArrayList<>();

    public void addUser(User user) {
        userSet.add(user);
        user.getRoomSet().add(this);
    }

    public void removeUser(User user) {
        userSet.remove(user);
        user.getRoomSet().remove(this);
    }

    public void clearUsers() {
        for (User user : new HashSet<>(userSet)) {
            removeUser(user);
        }
    }

    public void addChatMessage(ChatMessage message) {
        chatMessageList.add(message);
        message.setRoom(this);
    }

    public void removeChatMessage(ChatMessage message) {
        chatMessageList.remove(message);
        message.setRoom(null);
    }
}