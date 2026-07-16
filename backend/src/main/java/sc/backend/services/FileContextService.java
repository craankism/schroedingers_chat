package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import sc.backend.dtos.res.StoredFileMetaDTO;

import java.util.Optional;

@Profile("prod")
@RequiredArgsConstructor
@Service
public class FileContextService {

    private static final int MAX_FILE_CONTEXT_CHARS = 12_000;

    private final FileStorageService fileStorageService;
    private final FileTextExtractionService fileTextExtractionService;

    public Optional<String> buildFileContext(Integer fileId) {
        if (fileId == null) {
            return Optional.empty();
        }

        StoredFileMetaDTO metadata =
                fileStorageService.getFileMetadata(fileId);

        String extractedText =
                fileTextExtractionService.extractText(metadata.getFileId());

        if (extractedText == null || extractedText.isBlank()) {
            return Optional.of("""
                    File found: %s

                    No readable text could be extracted from this file.
                    """.formatted(metadata.getFilename()));
        }

        return Optional.of("""
                File name: %s

                Extracted file text:
                %s
                """.formatted(
                metadata.getFilename(),
                limitText(extractedText)
        ));
    }

    private String limitText(String text) {
        if (text.length() <= MAX_FILE_CONTEXT_CHARS) {
            return text;
        }

        return text.substring(0, MAX_FILE_CONTEXT_CHARS)
                + "\n\n[Only the first part of the file text is shown because the file is too long.]";
    }
}