package sc.backend.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.LoginDTO;
import sc.backend.dtos.req.RegisterDTO;
import sc.backend.dtos.res.AuthDTO;
import sc.backend.dtos.res.CodeDTO;
import sc.backend.entities.Registration;
import sc.backend.entities.User;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.exceptions.KeyInvalidException;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.UserRepository;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final ConversionService conversionService;
    private final AuthenticationManager authenticationManager;
    private final RegistrationRepository registrationRepository;

    @Transactional
    public AuthDTO register(String registryKey, RegisterDTO registerDTO) {
        Registration registration = registrationRepository.findByRegistrationCode(registryKey).orElseThrow(() ->
                        new KeyInvalidException("Key is not valid!"));

        if (registration.getUsedBy() != null) {
            throw new KeyInvalidException("Registration code has already been used!");
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
        registration.setUsedBy(user);
        registrationRepository.save(registration);

        String jwt = tokenService.generateTokenWithClaims(user);

        return convertToAuthDTO(user, jwt);
    }

    public CodeDTO checkValidity(String code) {
        Optional<Registration> registration = registrationRepository.findByRegistrationCode(code);

        boolean valid = registration.isPresent() && registration.get().getUsedBy() == null;

        return CodeDTO.builder()
                .isValid(valid)
                .build();
    }

    public AuthDTO login(LoginDTO loginDTO) {
        User user = getUserByEmail(userRepository.findByEmail(loginDTO.getEmail()));
        String email = user.getEmail();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, loginDTO.getPassword()));

        String jwt = tokenService.generateTokenWithClaims(user);

        return convertToAuthDTO(user, jwt);
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
