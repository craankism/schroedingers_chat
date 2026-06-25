package sc.backend.dtos.res;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDTO {

    private String content;
    private String sender;
}
