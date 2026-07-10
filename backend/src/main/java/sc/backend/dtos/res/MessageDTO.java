package sc.backend.dtos.res;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDTO {

    private int messageId;
    private int userId;
    private String content;
    private String sender;
    private LocalDateTime creationDate;
}
