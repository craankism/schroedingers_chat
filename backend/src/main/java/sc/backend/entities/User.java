package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String displayName;

    @Column(nullable = false)
    private boolean isAdmin;

    @Column(nullable = false)
    private boolean isTrainer;

    @Column(nullable = false)
    private boolean isActive;

    @Builder.Default
    @OneToMany(mappedBy = "createdBy")
    private Set<Room> createdRoomSet = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "userSet")
    private Set<Room> roomSet = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "uploadedBy")
    private List<StoredFile> storedFileList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "createdBy")
    private List<ChatMessage> chatMessageList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "createdBy")
    private Set<Registration> registrationSet = new HashSet<>();

    public void addCreatedRoom(Room room) {
        createdRoomSet.add(room);
        room.setCreatedBy(this);
    }

    public void removeCreatedRoom(Room room) {
        createdRoomSet.remove(room);
        room.setCreatedBy(null);
    }

    public void addChatMessage(ChatMessage chatMessage) {
        chatMessageList.add(chatMessage);
        chatMessage.setCreatedBy(this);
    }

    public void removeChatMessage(ChatMessage chatMessage) {
        chatMessageList.remove(chatMessage);
        chatMessage.setCreatedBy(null);
    }

    public void addCreatedRegistration(Registration registration) {
        registrationSet.add(registration);
        registration.setCreatedBy(this);
    }

    public void removeRegistration(Registration registration) {
        registrationSet.remove(registration);
        registration.setCreatedBy(null);
    }

    @Override
    public String getUsername() {
        return email;
    }

    //TODO: probably needs to be changed in the future
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (isAdmin) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        if (isTrainer) {
            authorities.add(new SimpleGrantedAuthority("ROLE_TRAINER"));
        }

        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
