package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import sc.backend.enums.DocumentRole;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "document_memberships", uniqueConstraints = @UniqueConstraint(columnNames = {"document_id", "user_id"}))
public class DocumentMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentRole role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}