package sc.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class SmtpConfig {

    @Id
    @Column(nullable = false)
    private int smtpId = 1;

    @Column(nullable = false)
    private String host;

    @Column(nullable = false)
    private int port;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordEncrypted;

    @Column(nullable = false)
    private String passwordIv;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private boolean tlsEnabled;

    @Column(nullable = false)
    private boolean configConfirmed;

    private String testAddress;
}
