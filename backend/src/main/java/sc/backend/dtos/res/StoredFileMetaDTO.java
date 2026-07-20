package sc.backend.dtos.res;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StoredFileMetaDTO {
    private int fileId;
    private String filename;
    private int uploadedById;
    private long size;
    private LocalDateTime uploadDate;
    private String mimeType;
    private Integer folderId;
    private String bucketName;
}
