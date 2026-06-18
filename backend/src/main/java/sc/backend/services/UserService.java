package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.LoginDTO;
import sc.backend.dtos.req.RegisterDTO;
import sc.backend.dtos.res.AuthDTO;
import sc.backend.entities.User;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.exceptions.UserAlreadyExistsException;
import sc.backend.repositories.UserRepository;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final ConversionService conversionService;
    private final AuthenticationManager authenticationManager;

    public AuthDTO register(RegisterDTO registerDTO) throws UserAlreadyExistsException {
        User user = User.builder()
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .displayName(registerDTO.getDisplayName())
                .isAdmin(false)
                .isTrainer(false)
                .build();
        userRepository.save(user);

        String jwt = tokenService.generateTokenWithClaims(user);

        return AuthDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .isAdmin(user.isAdmin())
                .isTrainer(user.isTrainer())
                .jwt(jwt)
                .build();
    }

    public AuthDTO login(LoginDTO loginDTO) {
        User user = getUserByEmail(userRepository.findByEmail(loginDTO.getEmail()));
        String email = user.getEmail();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, loginDTO.getPassword()));

        String jwt = tokenService.generateTokenWithClaims(user);

        return AuthDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .isAdmin(user.isAdmin())
                .isTrainer(user.isTrainer())
                .jwt(jwt)
                .build();
    }

    public User getUserByEmail(Optional<User> userOptional) {
        User user;

        try {
            user = conversionService.getEntityFromOptional(userOptional);
        } catch (EmptyOptionalException e) {
            throw new UsernameNotFoundException("Username not found!");
        }
        return user;
    }
}
