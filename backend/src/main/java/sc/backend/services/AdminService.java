package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.RegistrationDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.entities.Registration;
import sc.backend.entities.User;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.UserRepository;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    // MH: added Service for Random Code
    private final RegistryCodeService registryCodeService;
    private final UserService userService;

    public RegistrationDTO registerUserKey(RegisterUserKeyDTO registerUserKeyDTO, String creatorEmail) {
        User creator = userService.getUserByEmail(userRepository.findByEmail(creatorEmail));

        // MH: changed Code to use new Service
        String registryKey = registryCodeService.generateRegistryCode();

        Registration registration = Registration.builder()
                .isTrainer(registerUserKeyDTO.isTrainer())
                .createdAt(LocalDateTime.now())
                .registrationCode(registryKey)
                .createdBy(creator)
                .build();

        registrationRepository.save(registration);

        return RegistrationDTO.builder()
                .registrationId(registration.getRegistrationId())
                .isTrainer(registration.isTrainer())
                .createdAt(registration.getCreatedAt())
                .registrationCode(registration.getRegistrationCode())
                .createdBy(registration.getCreatedBy().getUserId())
                .build();
    }

    public UserDTO setAdmin(int userId) {
        User user = userService.findUserById(userId);

        boolean admin = user.isAdmin();
        user.setAdmin(!admin);
        userRepository.save(user);

        return userService.convertToDTO(user);
    }

    public UserDTO setTrainer(int userId) {
        User user = userService.findUserById(userId);

        boolean trainer = user.isTrainer();
        user.setTrainer(!trainer);
        userRepository.save(user);

        return userService.convertToDTO(user);
    }

    public UserDTO setActive(int userId) {
        User user = userService.findUserById(userId);

        boolean active = user.isActive();
        user.setActive(!active);
        userRepository.save(user);

        return userService.convertToDTO(user);
    }

    public void deleteUser(int userId) {
        User user  = userService.findUserById(userId);

        userRepository.delete(user);
    }
}
