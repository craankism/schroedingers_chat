package sc.backend.dtos.req;

import lombok.*;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateDocumentDTO {

    private String title;
    private List<Integer> documentMembershipList;

}
