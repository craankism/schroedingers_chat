package sc.backend.services;

import org.springframework.stereotype.Service;
import sc.backend.exceptions.EmptyOptionalException;

import java.util.Optional;

@Service
public class ConversionService {

    public <T> T getEntityFromOptional(Optional<T> optional) throws EmptyOptionalException {
        if (optional.isEmpty()) {
            throw new EmptyOptionalException("Unexpected empty Optional");
        }
        return optional.get();
    }
}
