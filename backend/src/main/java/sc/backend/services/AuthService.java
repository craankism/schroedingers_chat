package sc.backend.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.LoginDTO;
import sc.backend.dtos.req.RegisterDTO;
import sc.backend.dtos.res.AuthDTO;
import sc.backend.dtos.res.CodeDTO;
import sc.backend.entities.Registration;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.exceptions.KeyInvalidException;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.RoomRepository;
import sc.backend.repositories.UserRepository;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final RegistrationRepository registrationRepository;
    private final RoomRepository roomRepository;
    private final UserService userService;

    @Transactional
    public AuthDTO register(String registryKey, RegisterDTO registerDTO) {
        Registration registration = registrationRepository.findByRegistrationCode(registryKey).orElseThrow(() ->
                        new KeyInvalidException("Key is not valid!"));

        User user = User.builder()
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .displayName(registerDTO.getDisplayName())
                .isAdmin(false)
                .isTrainer(registration.isTrainer())
                .isActive(true)
                .build();

        Room room = roomRepository.findById(1).orElseThrow(() ->
                new EmptyOptionalException("Room not found!"));
        user.getRoomList().add(room);
        registrationRepository.delete(registration);
        userRepository.save(user);

        String jwt = tokenService.generateTokenWithClaims(user);

        return convertToAuthDTO(user, jwt);
    }

    public CodeDTO checkValidity(String code) {
        Optional<Registration> registration = registrationRepository.findByRegistrationCode(code);

        boolean valid = registration.isPresent();

        return CodeDTO.builder()
                .isValid(valid)
                .build();
    }

    public AuthDTO login(LoginDTO loginDTO) {
        User user = userService.getUserByEmail(userRepository.findByEmail(loginDTO.getEmail()));
        String email = user.getEmail();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, loginDTO.getPassword()));

        String jwt = tokenService.generateTokenWithClaims(user);

        return convertToAuthDTO(user, jwt);
    }

    private AuthDTO convertToAuthDTO(User user, String jwt) {
        return AuthDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .isAdmin(user.isAdmin())
                .isTrainer(user.isTrainer())
                .isActive(user.isActive())
                .jwt(jwt)
                .build();
    }
}
