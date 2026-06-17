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
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String displayName;

    @Column(nullable = false)
    private boolean isAdmin;

    @Column(nullable = false)
    private boolean isTrainer;

    @Builder.Default
    @OneToMany(mappedBy = "createdBy")
    private List<Room> createdRoomList =  new ArrayList<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "room_member",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "roomId"))
    private List<Room> roomList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "uploadedBy")
    private List<StoredFile> storedFileList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "createdBy")
    private List<Message> messageList = new ArrayList<>();
}
