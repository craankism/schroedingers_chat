package sc.backend.dtos.res;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SmtpDTO {
    private String host;
    private int port;
    private String username;
    private String sender;
    private boolean tlsEnabled;
    private boolean isConfirmed;
    private String testAddress;
}
