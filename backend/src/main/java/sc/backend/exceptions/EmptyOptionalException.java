package sc.backend.exceptions;

//TODO: Exception or RuntimeException?
public class EmptyOptionalException extends RuntimeException {
    public EmptyOptionalException(String message) {
        super(message);
    }
}
