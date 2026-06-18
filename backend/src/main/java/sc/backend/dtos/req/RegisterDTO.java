package sc.backend.dtos.req;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterDTO {

    private String email;
    private String password;
}
