package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
import sc.backend.exceptions.*;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.RoomRepository;
import sc.backend.repositories.UserRepository;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
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
    private final JavaMailSender mailSender;

    @Value("${DOMAIN:http://localhost:5173}")
    private String domain;

    @Transactional
    public String verifyEmail(String token) {
        String email = tokenService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found " + email));

        if (user.isActive()) {
            return "Email is already verified";
        }

        user.setActive(true);
        userRepository.save(user);
        return "Email verification successful";
    }

    public void sendVerificationEmail(User user) {
        String token = tokenService.generateToken(new HashMap<>(), user);
        String verifyUrl = domain + "/api/auth/verify/" +
                URLEncoder.encode(token, StandardCharsets.UTF_8);

        String message = "Click below to verify your email:\n" + verifyUrl;

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setSubject("Verify your email");
        mail.setText(message);
        mailSender.send(mail);
    }

    @Transactional
    public AuthDTO register(String registryKey, RegisterDTO registerDTO) {
        Registration registration = registrationRepository.findByRegistrationCode(registryKey)
                .orElseThrow(() -> new KeyInvalidException("Key is not valid!"));

        if (registration.getCreatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
            registrationRepository.delete(registration);
            throw new RegistrationExpiredException("Registration has expired!");
        }

        User user = User.builder()
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .displayName(registerDTO.getDisplayName())
                .isAdmin(false)
                .isTrainer(registration.isTrainer())
                .isActive(false)
                .build();

        userRepository.save(user);
        sendVerificationEmail(user);

        Room announcements = roomRepository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException("Announcement Room not found!"));

        Room room = roomRepository.findById(2).orElseThrow(() -> new EntityNotFoundException("Default chat Room not found!"));

        announcements.addUser(user);
        room.addUser(user);
        registrationRepository.delete(registration);

        String jwt = tokenService.generateTokenWithClaims(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        return convertToAuthDTO(user, jwt, refreshToken);
    }

    public CodeDTO checkValidity(String code) {
        Optional<Registration> registration = registrationRepository.findByRegistrationCode(code);

        if (registration.isEmpty()) {
            return CodeDTO.builder()
                    .isValid(false)
                    .build();
        }

        if (registration.get().getCreatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
            return CodeDTO.builder()
                    .isValid(false)
                    .build();
        }

        return CodeDTO.builder()
                .isValid(true)
                .build();
    }

    @Transactional
    public AuthDTO login(LoginDTO loginDTO) {
        User user = userService.findUserByEmail(loginDTO.getEmail());
        if (!user.isActive()) {
            throw new AccountInactiveException("Account is not active");
        }
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
