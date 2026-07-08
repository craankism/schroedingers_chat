package sc.backend.dtos.res;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EditorAuthDTO {

    private int userId;
    private String email;
    private String displayName;

}
