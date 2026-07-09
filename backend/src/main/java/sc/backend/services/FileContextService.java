package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import sc.backend.dtos.res.StoredFileMetaDTO;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Profile("prod")
@RequiredArgsConstructor
@Service
public class FileContextService {

    private static final int MAX_FILE_CONTEXT_CHARS = 12_000;

    private static final Pattern FILE_NAME_PATTERN = Pattern.compile(
            "(?i)(?<!\\S)([\\p{L}\\p{N}_().-]+\\.(pdf|txt|docx|doc|pptx|html|md))(?!\\S)"
    );

    private final FileStorageService fileStorageService;
    private final FileTextExtractionService fileTextExtractionService;

    public Optional<String> buildFileContext(String prompt) {
        Optional<String> filename = extractFilename(prompt);

        if (filename.isEmpty()) {
            return Optional.empty();
        }

        StoredFileMetaDTO metadata = fileStorageService.getFileMetadataByFilename(filename.get());

        String extractedText = fileTextExtractionService.extractText(metadata.getFileId());

        if (extractedText.isBlank()) {
            return Optional.of("""
                    File found: %s

                    No readable text could be extracted from this file.
                    """.formatted(metadata.getFilename()));
        }

        String limitedText = limitText(extractedText);

        return Optional.of("""
                File name: %s

                Extracted file text:
                %s
                """.formatted(metadata.getFilename(), limitedText));
    }

    private Optional<String> extractFilename(String prompt) {
        if (prompt == null) {
            return Optional.empty();
        }

        Matcher matcher = FILE_NAME_PATTERN.matcher(prompt);

        if (!matcher.find()) {
            return Optional.empty();
        }

        return Optional.of(matcher.group(1).trim());
    }

    private String limitText(String text) {
        if (text.length() <= MAX_FILE_CONTEXT_CHARS) {
            return text;
        }

        return text.substring(0, MAX_FILE_CONTEXT_CHARS)
                + "\n\n[Only the first part of the file text is shown because the file is too long.]";
    }
}