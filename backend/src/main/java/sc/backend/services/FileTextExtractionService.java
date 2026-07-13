package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import sc.backend.dtos.res.StoredFileMetaDTO;

import java.io.InputStream;
import java.util.List;

@Profile("prod")
@RequiredArgsConstructor
@Service
public class FileTextExtractionService {

    private final FileStorageService fileStorageService;

    public String extractText(Integer fileId) {
        try {
            StoredFileMetaDTO metadata = fileStorageService.getFileMetadata(fileId);

            try (InputStream decryptedInputStream = fileStorageService.downloadFile(fileId)) {
                byte[] decryptedFileBytes = decryptedInputStream.readAllBytes();

                ByteArrayResource resource = new ByteArrayResource(decryptedFileBytes) {
                    @Override
                    public String getFilename() {
                        return metadata.getFilename();
                    }
                };

                TikaDocumentReader reader = new TikaDocumentReader(resource);

                List<Document> documents = reader.read();

                StringBuilder extractedText = new StringBuilder();

                for (Document document : documents) {
                    extractedText
                            .append(document.getText())
                            .append("\n");
                }

                return cleanExtractedText(extractedText.toString());
            }
        } catch (Exception exception) {
            throw new RuntimeException(
                    "Could not extract text from file with id " + fileId,
                    exception
            );
        }
    }

    private String cleanExtractedText(String text) {
        if (text == null) {
            return "";
        }

        return text
                .replace("\u0000", "")
                .replaceAll("[ \\t]+", " ")
                .replaceAll("\\n{3,}", "\n\n")
                .trim();
    }
}