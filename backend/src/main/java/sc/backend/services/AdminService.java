package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.RegistrationDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.entities.ChatMessage;
import sc.backend.entities.Registration;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;

@Transactional
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

        creator.addCreatedRegistration(registration);
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

        user.setAdmin(!user.isAdmin());

        return userService.convertToDTO(user);
    }

    public UserDTO setTrainer(int userId) {
        User user = userService.findUserById(userId);

        user.setTrainer(!user.isTrainer());

        return userService.convertToDTO(user);
    }

    public UserDTO setActive(int userId) {
        User user = userService.findUserById(userId);

        user.setActive(!user.isActive());

        return userService.convertToDTO(user);
    }

    public void deleteUser(int userId) {
        User user = userService.findUserById(userId);

        for (Room room : new HashSet<>(user.getRoomSet())) {
            room.removeUser(user);
        }

        for (Room room : new HashSet<>(user.getCreatedRoomSet())) {
            user.removeCreatedRoom(room);
        }

        for (ChatMessage message : new ArrayList<>(user.getChatMessageList())) {
            user.removeChatMessage(message);
        }

        for (Registration registration : new HashSet<>(user.getRegistrationSet())) {
            user.removeRegistration(registration);
        }

        userRepository.delete(user);
    }
}
