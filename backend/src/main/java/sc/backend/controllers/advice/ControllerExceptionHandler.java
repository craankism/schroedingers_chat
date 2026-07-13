package sc.backend.controllers.advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import sc.backend.dtos.res.ErrorResponseDTO;
import sc.backend.exceptions.*;

import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;

@Slf4j
@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(KeyInvalidException.class)
    public ResponseEntity<ErrorResponseDTO> handleKeyInvalid(KeyInvalidException e, WebRequest request) {
        log.warn("Invalid key encountered: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.CONFLICT.value(),
                "INVALID_KEY",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(EmptyOptionalException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmptyOptional(EmptyOptionalException e, WebRequest request) {
        log.warn("Empty optional encountered: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "RESOURCE_NOT_FOUND",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(TokenInvalidException.class)
    public ResponseEntity<ErrorResponseDTO> handleTokenInvalid(TokenInvalidException e, WebRequest request) {
        log.warn("Invalid token encountered: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.UNAUTHORIZED.value(),
                "TOKEN_INVALID",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserNotFound(UserNotFoundException e, WebRequest request) {
        log.warn("User not found: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "USER_NOT_FOUND",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleFileNotFound(FileNotFoundException e, WebRequest request) {
        log.warn("File not found: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "FILE_NOT_FOUND",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponseDTO> handleFileStorage(FileStorageException e, WebRequest request) {
        log.error("File storage operation failed", e);
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "STORAGE_ERROR",
                "Saving operation failed",
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidInput(InvalidInputException e, WebRequest request) {
        log.warn("Invalid input provided: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "INVALID_INPUT",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleEntityNotFound(EntityNotFoundException e, WebRequest request) {
        log.warn("Entity not found: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                "ENTITY_NOT_FOUND",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponseDTO> handleResponseStatus(ResponseStatusException e, WebRequest request) {
        log.warn("Response status exception: {} - {}", e.getStatusCode(), e.getReason());

        HttpStatus resolved = HttpStatus.resolve(e.getStatusCode().value());
        String errorLabel = resolved != null ? resolved.getReasonPhrase() : "RESPONSE_STATUS";

        ErrorResponseDTO body = new ErrorResponseDTO(
                e.getStatusCode().value(),
                errorLabel,
                e.getReason(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(e.getStatusCode()).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(AccessDeniedException e, WebRequest request) {
        log.warn("Access denied: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.FORBIDDEN.value(),
                "ACCESS_DENIED",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDTO> handleAuthentication(AuthenticationException e, WebRequest request) {
        log.warn("Authentication failed: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.UNAUTHORIZED.value(),
                "AUTHENTICATION_FAILED",
                "Authentication failed",
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgument(IllegalArgumentException e, WebRequest request) {
        log.warn("Illegal argument: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "ILLEGAL_ARGUMENT",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleUnhandled(Exception e, WebRequest request) {
        log.error("Unhandled exception occurred", e);
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_ERROR",
                "An unexpected Error happened. What have you done?",
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(AccountInactiveException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccountInactive(AccountInactiveException e, WebRequest request) {
        log.warn("Account inactive: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.FORBIDDEN.value(),
                "ACCOUNT_INACTIVE",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(RegistrationExpiredException.class)
    public ResponseEntity<ErrorResponseDTO> handleRegistrationExpired(RegistrationExpiredException e, WebRequest request) {
        log.warn("Registration expired: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.GONE.value(),
                "REGISTRATION_EXPIRED",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.GONE).body(body);
    }

    @ExceptionHandler(PermissionException.class)
    public ResponseEntity<ErrorResponseDTO> handlePermission(PermissionException e, WebRequest request) {
        log.warn("Permission denied: {}", e.getMessage());
        ErrorResponseDTO body = new ErrorResponseDTO(
                HttpStatus.FORBIDDEN.value(),
                "PERMISSION_DENIED",
                e.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }
}