package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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

    @Column(unique = true)
    private String email;

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
    private List<Room> createdRoomList = new ArrayList<>();

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
    private List<ChatMessage> chatMessageList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "createdBy")
    private List<Registration> registrationList = new ArrayList<>();

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
        return true;
    }
}
