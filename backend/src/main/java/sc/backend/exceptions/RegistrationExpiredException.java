package sc.backend.exceptions;

public class RegistrationExpiredException extends RuntimeException {
    public RegistrationExpiredException(String message) {
        super(message);
    }
}
