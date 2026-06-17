package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

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
    private int size;

    @Column(nullable = false)
    private String path;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User uploadedBy;
}
