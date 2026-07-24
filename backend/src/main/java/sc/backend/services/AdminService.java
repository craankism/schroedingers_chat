package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.RegistrationDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.entities.Registration;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.RoomRepository;

import java.time.LocalDateTime;

@Transactional
@RequiredArgsConstructor
@Service
public class AdminService {

    private final RegistrationRepository registrationRepository;
    private final RegistryCodeService registryCodeService;
    private final UserService userService;
    private final RoomService roomService;
    private final RoomRepository roomRepository;

    public RegistrationDTO registerUserKey(RegisterUserKeyDTO registerUserKeyDTO, String creatorEmail) {
        User creator = userService.findUserByEmail(creatorEmail);

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

        Room userRoom = roomService.findRoomById(2);
        Room trainerRoom = roomService.findRoomById(3);
        if (user.isTrainer()) {
            userRoom.removeUser(user);
            trainerRoom.addUser(user);
        } else {
            trainerRoom.removeUser(user);
            userRoom.addUser(user);
        }
        roomRepository.save(userRoom);
        roomRepository.save(trainerRoom);

        return userService.convertToDTO(user);
    }

    public UserDTO setActive(int userId) {
        User user = userService.findUserById(userId);

        user.setActive(!user.isActive());

        return userService.convertToDTO(user);
    }

    public void deleteUser(int userId, String authenticatedEmail) {
        userService.deleteUser(userId, authenticatedEmail);
    }
}
