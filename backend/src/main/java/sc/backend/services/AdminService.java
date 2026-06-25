package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.RegistrationDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.entities.Registration;
import sc.backend.entities.User;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.UserRepository;

import java.util.Date;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    // MH: added Service for Random Code
    private final RegistryCodeService registryCodeService;
    private final UserService userService;

    public RegistrationDTO registerUserKey(RegisterUserKeyDTO registerUserKeyDTO, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail).orElseThrow(() ->
                new UsernameNotFoundException("Authenticated user not found"));

        // MH: changed Code to use new Service
        String registryKey = registryCodeService.generateRegistryCode();

        Registration registration = Registration.builder()
                .isTrainer(registerUserKeyDTO.isTrainer())
                .createdAt(new Date(System.currentTimeMillis()))
                .registrationCode(registryKey)
                .createdBy(creator)
                .build();

        Registration savedRegistration = registrationRepository.save(registration);

        return RegistrationDTO.builder()
                .registrationId(savedRegistration.getRegistrationId())
                .isTrainer(savedRegistration.isTrainer())
                .createdAt(savedRegistration.getCreatedAt())
                .registrationCode(savedRegistration.getRegistrationCode())
                .createdBy(savedRegistration.getCreatedBy().getUserId())
                .build();
    }

    public UserDTO setAdmin(int userId) {
        User user = userService.findUserById(userId);

        boolean admin = user.isAdmin();
        user.setAdmin(!admin);

        return userService.convertToDTO(user);
    }

    public UserDTO setTrainer(int userId) {
        User user = userService.findUserById(userId);

        boolean trainer = user.isTrainer();
        user.setTrainer(!trainer);

        return userService.convertToDTO(user);
    }

    public UserDTO setActive(int userId) {
        User user = userService.findUserById(userId);

        boolean active = user.isActive();
        user.setActive(!active);

        return userService.convertToDTO(user);
    }

    public void  deleteUser(int userId) {
        User user  = userService.findUserById(userId);

        userRepository.delete(user);
    }
}
