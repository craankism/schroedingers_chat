package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int registrationId;

    @Column(nullable = false)
    private boolean isTrainer;

    //TODO: best date type?
    @Column(nullable = false)
    private Date createdAt;

    private String registrationCode;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User createdBy;
}
