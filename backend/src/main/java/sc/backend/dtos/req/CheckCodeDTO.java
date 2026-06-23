package sc.backend.dtos.req;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CheckCodeDTO {

    private String code;
}
