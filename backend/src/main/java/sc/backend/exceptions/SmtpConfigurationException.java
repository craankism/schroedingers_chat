package sc.backend.exceptions;

public class SmtpConfigurationException extends RuntimeException {

    public SmtpConfigurationException(String message) {
        super(message);
    }

    public SmtpConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }
}