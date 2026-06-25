package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sc.backend.dtos.res.UserDTO;
import sc.backend.entities.User;
import sc.backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

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

    public User findUserById(int userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                new EntityNotFoundException("User #" + userId + " not found!"));
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
