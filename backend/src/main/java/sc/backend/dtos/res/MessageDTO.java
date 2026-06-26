package sc.backend.dtos.res;

import lombok.*;

import java.util.Date;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDTO {

    private int messageId;
    private String content;
    private String sender;
    private Date creationDate;
}
