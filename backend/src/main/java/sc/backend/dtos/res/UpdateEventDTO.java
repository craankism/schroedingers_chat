package sc.backend.dtos.res;

import java.util.Map;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateEventDTO {
    private String type;
    private int id;
    private Map<Integer, Boolean> online;
}
