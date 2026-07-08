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
    private String name;
    private String title;
    private User creator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DocumentMembership> documentMembershipList;

}
