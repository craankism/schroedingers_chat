package sc.backend.components;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.repositories.RoomRepository;
import sc.backend.repositories.UserRepository;

@Component
public class SuperAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoomRepository roomRepository;

    @Value("${superadmin.email}")
    private String adminEmail;

    @Value("${superadmin.password}")
    private String adminPassword;

    public SuperAdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String[] users = {"pascal", "matthias", "sascha", "kevin", "rene", "philipp", "julia", "haru"};

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .displayName("Super Admin")
                .isAdmin(true)
                .isTrainer(false)
                .isActive(true)
                .build();
            userRepository.save(admin);

            Room room = Room.builder()
                    .name("Schroedingers Box")
                    .createdBy(admin)
                    .build();
            room.getUserList().add(admin);

            for (int i = 0; i < users.length; i++) {
                User user = User.builder()
                        .email(users[i] + "@gmail.com")
                        .password(passwordEncoder.encode("123"))
                        .displayName(users[i])
                        .isAdmin(false)
                        .isTrainer(false)
                        .isActive(true)
                        .build();
                userRepository.save(user);
                room.getUserList().add(user);
            }
            roomRepository.save(room);

            System.out.println("SuperAdmin erstellt: " + adminEmail);
        } else {
            System.out.println("SuperAdmin existiert bereits: " + adminEmail);
        }
    }
}
