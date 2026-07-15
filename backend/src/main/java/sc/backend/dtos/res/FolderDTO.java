package sc.backend.dtos.res;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FolderDTO {
    private int folderId;
    private String name;
    private Integer parentFolderId;
    private int createdBy;
}
