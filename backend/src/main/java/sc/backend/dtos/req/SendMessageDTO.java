package sc.backend.dtos.req;

import lombok.*;
import sc.backend.enums.AiMode;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SendMessageDTO {

    private String content;
    private AiMode aiMode;
}
