package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.RegistrationDTO;
import sc.backend.entities.Registration;
import sc.backend.entities.User;
import sc.backend.repositories.RegistrationRepository;
import sc.backend.repositories.UserRepository;

import java.util.Date;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    public RegistrationDTO registerUserKey(RegisterUserKeyDTO registerUserKeyDTO, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail).orElseThrow(() ->
                new UsernameNotFoundException("Authenticated user not found"));

        //TODO: replace generate Key placeholder
        String registryKey = UUID.randomUUID().toString().replace("-", "");
        registryKey = registryKey.substring(0, 10);

        Registration registration = Registration.builder()
                .isTrainer(registerUserKeyDTO.isTrainer())
                .createdAt(new Date(System.currentTimeMillis()))
                .registrationCode(registryKey)
                .createdBy(creator)
                .build();

        Registration savedRegistration = registrationRepository.save(registration);

        return RegistrationDTO.builder()
                .registrationId(savedRegistration.getRegistrationId())
                .isTrainer(savedRegistration.isTrainer())
                .createdAt(savedRegistration.getCreatedAt())
                .registrationCode(savedRegistration.getRegistrationCode())
                .createdBy(savedRegistration.getCreatedBy().getUserId())
                .build();
    }
}
