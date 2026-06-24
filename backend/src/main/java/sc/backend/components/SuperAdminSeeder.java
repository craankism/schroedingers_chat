
//TODO deprecated, delete later

//package sc.backend.components;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Profile;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//import sc.backend.entities.User;
//import sc.backend.repositories.UserRepository;
//import sc.backend.services.TokenService;
//
//@Component
//@Profile({"dev", "test"})
//@RequiredArgsConstructor
//public class SuperAdminSeeder implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final TokenService tokenService;
//
//    @Override
//    public void run(String... args) {
//        String adminEmail = "admin@example.com";
//
//        if (userRepository.findByEmail(adminEmail).isPresent()) {
//            return;
//        }
//
//        User admin = User.builder()
//                .email(adminEmail)
//                .password(passwordEncoder.encode("admin123"))
//                .displayName("Super Admin")
//                .isAdmin(true)
//                .isTrainer(false)
//                .build();
//
//        userRepository.save(admin);
//
//        tokenService.generateTokenWithClaims(admin);
//    }
//
//}