package sc.backend.dtos.req;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateFolderDTO {
    private String name;
    private Integer parentFolderId;
}
