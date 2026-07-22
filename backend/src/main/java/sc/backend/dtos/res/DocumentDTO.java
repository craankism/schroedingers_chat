package sc.backend.dtos.res;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DocumentDTO {

    private int documentId;
    private String title;
    private int creatorId;
    private byte[] content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Integer> documentMembershipList;

}
