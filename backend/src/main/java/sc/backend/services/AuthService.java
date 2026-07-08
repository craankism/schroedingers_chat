package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.LoginDTO;
import sc.backend.dtos.req.RegisterDTO;
import sc.backend.dtos.res.AuthDTO;
import sc.backend.dtos.res.CodeDTO;
import sc.backend.entities.RefreshToken;
import sc.backend.entities.Registration;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.exceptions.KeyInvalidException;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.RoomRepository;
import sc.backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Transactional(readOnly = true)
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

        if (registration.getCreatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
            registrationRepository.delete(registration);
            throw new KeyInvalidException("Registration has expired!");
        }

        User user = User.builder()
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .displayName(registerDTO.getDisplayName())
                .isAdmin(false)
                .isTrainer(registration.isTrainer())
                .isActive(true)
                .build();
        userRepository.save(user);

        Room announcements = roomRepository.findById(1).orElseThrow(() ->
                new EmptyOptionalException("Room not found!"));

        Room room = roomRepository.findById(2).orElseThrow(() ->
                new EmptyOptionalException("Room not found!"));

        announcements.addUser(user);
        room.addUser(user);
        registrationRepository.delete(registration);

        String jwt = tokenService.generateTokenWithClaims(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        return convertToAuthDTO(user, jwt, refreshToken);
    }

    public CodeDTO checkValidity(String code) {
        Optional<Registration> registration = registrationRepository.findByRegistrationCode(code);

        boolean valid = registration.isPresent();

        return CodeDTO.builder()
                .isValid(valid)
                .build();
    }

    @Transactional
    public AuthDTO login(LoginDTO loginDTO) {
        User user = userService.getUserByEmail(userRepository.findByEmail(loginDTO.getEmail()));
        String email = user.getEmail();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, loginDTO.getPassword()));

        String jwt = tokenService.generateTokenWithClaims(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        return convertToAuthDTO(user, jwt, refreshToken);
    }

    @Transactional
    public AuthDTO refresh(String rawRefreshToken) {
        RefreshToken validateToken = tokenService.validateRefreshToken(rawRefreshToken);
        User user = validateToken.getUser();
        String newRefreshTokenStr = tokenService.rotateRefreshToken(rawRefreshToken);
        String newJwt = tokenService.generateTokenWithClaims(user);
        return convertToAuthDTO(user, newJwt, newRefreshTokenStr);
    }

    public int logout(String rawRefreshToken) {
        RefreshToken validateToken = tokenService.validateRefreshToken(rawRefreshToken);
        int userId = validateToken.getUser().getUserId();
        tokenService.deleteRefreshToken(rawRefreshToken);
        return userId;
    }

    private AuthDTO convertToAuthDTO(User user, String jwt, String refreshToken) {
        return AuthDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .isAdmin(user.isAdmin())
                .isTrainer(user.isTrainer())
                .isActive(user.isActive())
                .jwt(jwt)
                .refreshToken(refreshToken)
                .build();
    }
}
