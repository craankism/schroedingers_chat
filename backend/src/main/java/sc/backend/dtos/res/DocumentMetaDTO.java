package sc.backend.dtos.res;

import lombok.*;
import sc.backend.entities.DocumentMembership;
import sc.backend.entities.User;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DocumentMetaDTO {

    private int documentId;
    private String title;
    private int creatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Integer> documentMembershipList;

}
