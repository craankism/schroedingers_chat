package sc.backend.dtos.req;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterUserKeyDTO {

    private boolean isAdmin;
    private boolean isTrainer;
}
