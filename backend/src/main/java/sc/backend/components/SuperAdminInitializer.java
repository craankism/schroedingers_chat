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

    public SuperAdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                 RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
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

            Room announcements = Room.builder()
                    .name("Announcement")
                    .build();
            admin.addCreatedRoom(announcements);
            announcements.addUser(admin);
            roomRepository.save(announcements);

            Room userRoom = Room.builder()
                    .name("Schroedingers Student Box")
                    .build();
            admin.addCreatedRoom(userRoom);
            roomRepository.save(userRoom);

            Room trainerRoom = Room.builder()
                    .name("Schroedingers Trainer Box")
                    .build();
            admin.addCreatedRoom(trainerRoom);
            roomRepository.save(trainerRoom);

            System.out.println("SuperAdmin created: " + adminEmail);
        } else {
            System.out.println("SuperAdmin exists already: " + adminEmail);
        }
    }
}