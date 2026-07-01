package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.res.UserDTO;
import sc.backend.entities.User;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final ConversionService conversionService;

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

    public User getUserByEmail(Optional<User> userOptional) {
        User user;

        try {
            user = conversionService.getEntityFromOptional(userOptional);
        } catch (EmptyOptionalException e) {
            throw new UsernameNotFoundException("Email not found!");
        }
        return user;
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
