package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.EditUserDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.entities.ChatMessage;
import sc.backend.entities.Registration;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.exceptions.PermissionException;
import sc.backend.exceptions.UserNotFoundException;
import sc.backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        List<UserDTO> userDTOList = new ArrayList<>();

        for (User user : userRepository.findAll()) {
            userDTOList.add(convertToDTO(user));
        }

        return userDTOList;
    }

    public UserDTO getUser(int userId) {
        User user = findUserById(userId);

        return convertToDTO(user);
    }

    @Transactional
    public UserDTO editUser(int userId, EditUserDTO editUserDTO, String authenticatedEmail) {
        User authenticatedUser = findUserByEmail(authenticatedEmail);

        if (authenticatedUser.getUserId() != userId && !authenticatedUser.isAdmin()) {
            throw new PermissionException("You are not allowed to edit this user");
        }

        User user = findUserById(userId);

        if (!passwordEncoder.matches(editUserDTO.getOldPassword(), user.getPassword())) {
            throw new PermissionException("Old password is incorrect");
        }

        if (editUserDTO.getDisplayName() != null && !editUserDTO.getDisplayName().isBlank()) {
            user.setDisplayName(editUserDTO.getDisplayName());
        }

        if (editUserDTO.getNewPassword() != null && !editUserDTO.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(editUserDTO.getNewPassword()));
        }

        return convertToDTO(user);
    }

    @Transactional
    public void deleteUser(int userId, String authenticatedEmail) {
        User authenticatedUser = findUserByEmail(authenticatedEmail);

        if (authenticatedUser.getUserId() != userId && !authenticatedUser.isAdmin()) {
            throw new PermissionException("You are not allowed to delete this user");
        }

        User user = findUserById(userId);

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

    public User findUserById(int userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User #" + userId + " not found!"));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User " + email + " not found"));
    }

    public UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .isAdmin(user.isAdmin())
                .isTrainer(user.isTrainer())
                .isActive(user.isActive())
                .build();
    }
}
