package sc.backend.dtos.res;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthDTO {

    private int userId;
    private String email;
    private String displayName;
    @JsonProperty("isAdmin")
    private boolean isAdmin;
    @JsonProperty("isTrainer")
    private boolean isTrainer;
    private boolean isActive;
    private String jwt;
    private String refreshToken;
}
