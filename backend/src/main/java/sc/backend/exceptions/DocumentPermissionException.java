package sc.backend.exceptions;

public class DocumentPermissionException extends RuntimeException {
    public DocumentPermissionException(String message) {
        super(message);
    }
}
