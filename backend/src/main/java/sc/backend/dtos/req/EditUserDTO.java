package sc.backend.dtos.req;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EditUserDTO {

    private String displayName;
    private String oldPassword;
    private String newPassword;
}
