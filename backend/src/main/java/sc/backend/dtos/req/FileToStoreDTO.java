package sc.backend.dtos.req;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FileToStoreDTO {
    private int uploadedBy;
}
