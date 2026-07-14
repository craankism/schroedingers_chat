package sc.backend.dtos.res;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FolderDTO {
    private int id;
    private String name;
    private Integer parentFolderId;
}
