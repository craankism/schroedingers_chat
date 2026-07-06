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
@Table(name = "documents")
public class Documents {

    @Id
    @Column(nullable = false, unique = true)
    private String name;

    @Lob
    @Column(nullable = false)
    private byte[] content;

    private LocalDateTime updatedAt;

}
