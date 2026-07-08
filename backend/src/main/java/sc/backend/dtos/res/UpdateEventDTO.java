package sc.backend.dtos.res;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateEventDTO {
    private String type;
    private int id;
}
