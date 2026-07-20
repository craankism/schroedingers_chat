package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.internet.MimeMessage;
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

import lombok.extern.slf4j.Slf4j;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final RegistrationRepository registrationRepository;
    private final RoomRepository roomRepository;
    private final UserService userService;
    private final DynamicMailSenderService dynamicMailSenderService;

    @Value("${DOMAIN:http://localhost:5173}")
    private String domain;

    @Transactional
    public AuthDTO verifyEmail(String token) {
        String email = tokenService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found " + email));

        if (user.isActive()) {
            throw new RuntimeException("Account already active");
        }

        user.setActive(true);
        userRepository.save(user);
        String jwt = tokenService.generateTokenWithClaims(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        return convertToAuthDTO(user, jwt, refreshToken);
    }

    public void sendVerificationEmail(User user) {
        boolean isConfirmed = dynamicMailSenderService.isSmtpConfirmed();

        if (!isConfirmed) {
            log.info("SMTP not confirmed, activating user directly: {}", user.getEmail());
            user.setActive(true);
            userRepository.save(user);
            return;
        }

        String token = tokenService.generateToken(new HashMap<>(), user);
        String verifyLink = "https://" + domain + "/verify/" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        String htmlMessage = "<p>Click below to verify your email:</p>" +
                "<a href=\"" + verifyLink + "\" style=\"text-decoration: none;\">" +
                "<button style=\"border: none; background-color: green; color: white; padding: 10px 20px; " +
                "border-radius: 10%; font-size: 2rem; cursor: pointer;\">Verify</button>" +
                "</a>";

        try {
            MimeMessage mail = dynamicMailSenderService.getMailSender().createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, "utf-8");
            helper.setFrom(dynamicMailSenderService.getSenderAddress());
            helper.setTo(user.getEmail());
            helper.setSubject("Verify your email");
            helper.setText(htmlMessage, true);
            dynamicMailSenderService.getMailSender().send(mail);
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send verification email, activating user anyway: {}", user.getEmail(), e);
            user.setActive(true);
            userRepository.save(user);
        }
    }

    @Transactional
    public void sendResetMail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String token = tokenService.generateToken(new HashMap<>() {
            {
                put("type", "password_reset");
            }
        }, user);
        String resetLink = "https://" + domain + "/reset/" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        String htmlMessage = "<p>Click below to reset your password:</p>" +
                "<a href=\"" + resetLink + "\" style=\"text-decoration: none;\">" +
                "<button style=\"border: none; background-color: green; color: white; padding: 10px 20px; " +
                "border-radius: 10%; font-size: 2rem; cursor: pointer;\">Reset</button>" +
                "</a>" +
                "<p>This link expires in 15 mins.</p>";

        try {
            MimeMessage mail = dynamicMailSenderService.getMailSender().createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, "utf-8");
            helper.setFrom(dynamicMailSenderService.getSenderAddress());
            helper.setTo(user.getEmail());
            helper.setSubject("Reset password");
            helper.setText(htmlMessage, true);
            dynamicMailSenderService.getMailSender().send(mail);
            log.info("Reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send reset email: {}", user.getEmail(), e);
        }
    }

    @Transactional
    public void performPasswordReset(String token, String newPassword) {
        String email;
        String type;
        try {
            email = tokenService.extractEmail(token);
            type = tokenService.extractClaim(token, claims -> claims.get("type", String.class));
        } catch (Exception e) {
            throw new TokenInvalidException("Invalid or expired reset token");
        }
        if (!"password_reset".equals(type)) {
            throw new TokenInvalidException("Invalid reset token");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
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

        Room userRoom = roomRepository.findById(2)
                .orElseThrow(() -> new EntityNotFoundException("Default chat Room not found!"));
        Room trainerRoom = roomRepository.findById(3)
                .orElseThrow(() -> new EntityNotFoundException("Default chat Room not found!"));
        if (user.isTrainer())
            trainerRoom.addUser(user);
        else
            userRoom.addUser(user);
        announcements.addUser(user);
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
