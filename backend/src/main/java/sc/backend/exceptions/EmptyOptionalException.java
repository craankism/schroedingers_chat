package sc.backend.exceptions;

public class EmptyOptionalException extends RuntimeException {
    public EmptyOptionalException(String message) {
        super(message);
    }
}
