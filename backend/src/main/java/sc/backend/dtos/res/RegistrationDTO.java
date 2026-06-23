package sc.backend.dtos.res;

import lombok.*;

import java.util.Date;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegistrationDTO {

    private int registrationId;
    private boolean isTrainer;
    //TODO: best date type?
    private Date createdAt;
    private String registrationCode;
    private int createdBy;
}
