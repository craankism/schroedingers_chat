package sc.backend.dtos.res;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ErrorResponseDTO{
        private int status;
        private String error;
        private String message;
        private LocalDateTime timestamp;
        private String path;
}