package sc.backend.dtos.res;

import java.time.LocalDateTime;

public record ErrorResponseDTO(
        int status,
        String error,
        String message,
        LocalDateTime timestamp,
        String path
) {
}