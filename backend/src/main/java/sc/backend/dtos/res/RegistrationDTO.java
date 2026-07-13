package sc.backend.dtos.res;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegistrationDTO {

    private int registrationId;
    private boolean isTrainer;
    private LocalDateTime createdAt;
    private String registrationCode;
    private int createdBy;
}
