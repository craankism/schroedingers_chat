package sc.backend.dtos.req;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SmtpConfigDTO {
    private String host;
    private int port;
    private String username;
    private String password;
    private String sender;
    private boolean tlsEnabled;
}
