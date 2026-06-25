package sc.backend.dtos.res;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDTO {

    private int userId;
    private String email;
    private String displayName;
    private boolean isAdmin;
    private boolean isTrainer;
    private boolean isActive;
}
