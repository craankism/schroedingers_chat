package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.LoginDTO;
import sc.backend.dtos.req.RegisterDTO;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.AuthDTO;
import sc.backend.entities.User;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.exceptions.KeyInvalidException;
import sc.backend.exceptions.UserAlreadyExistsException;
import sc.backend.repositories.UserRepository;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final ConversionService conversionService;
    private final AuthenticationManager authenticationManager;

    public AuthDTO registerUserKey(RegisterUserKeyDTO registerUserKeyDTO) throws UserAlreadyExistsException {
        //TODO: replace generate Key placeholder
        String registryKey = UUID.randomUUID().toString().replace("-", "");
        registryKey = registryKey.substring(0, 10);

        User user = User.builder()
                .isAdmin(registerUserKeyDTO.isAdmin())
                .isTrainer(registerUserKeyDTO.isTrainer())
                .registryKey(registryKey)
                .build();
        userRepository.save(user);

        String jwt = tokenService.generateTokenWithClaims(user);

        return convertToAuthDTO(user, jwt);
    }

    public AuthDTO register(String registryKey, RegisterDTO registerDTO) {
        User user = userRepository.findByRegistryKey(registryKey).orElseThrow(() ->
                        new KeyInvalidException("Key is invalid!"));

        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setDisplayName(registerDTO.getDisplayName());

        userRepository.save(user);

        String jwt = tokenService.generateTokenWithClaims(user);

        return convertToAuthDTO(user, jwt);
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
                .jwt(jwt)
                .build();
    }
}
