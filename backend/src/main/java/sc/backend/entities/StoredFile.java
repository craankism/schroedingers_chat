package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class StoredFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int fileId;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String storedFilename;

    @Column(nullable = false)
    private long size;

    private String mimeType;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime uploadDate;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @Column(nullable = false)
    private byte[] iv;

    @Column
    private byte[] encryptedDek;

    @Column(nullable = false)
    private String bucketName;
}
