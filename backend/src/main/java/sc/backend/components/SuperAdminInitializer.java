package sc.backend.components;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.entities.User;
import sc.backend.repositories.UserRepository;

@Component
public class SuperAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${superadmin.email}")
    private String adminEmail;

    @Value("${superadmin.password}")
    private String adminPassword;

    public SuperAdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!userRepository.existsByEmail(adminEmail)) {
            // User Entity anpassen je nach deinem Paketnamen
            User superAdmin = new User();
            superAdmin.setEmail(adminEmail);
            superAdmin.setPassword(passwordEncoder.encode(adminPassword));
            superAdmin.setDisplayName("Super Admin");
            superAdmin.setAdmin(true);
            superAdmin.setTrainer(false);
            userRepository.save(superAdmin);
            System.out.println("SuperAdmin erstellt: " + adminEmail);
        } else {
            System.out.println("SuperAdmin existiert bereits: " + adminEmail);
        }
    }
}
