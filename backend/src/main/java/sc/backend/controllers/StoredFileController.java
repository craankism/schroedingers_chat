package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sc.backend.dtos.res.StoredFileDTO;
import sc.backend.services.FileStorageService;

import java.io.InputStream;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class StoredFileController {

    private final FileStorageService fileStorageService;


    /**
     * Upload Endpunkt
     * - Nimmt multipart/form-data entgegen
     * - roomId und userId kommen als RequestParam (spaeter aus JWT)
     */
    @PostMapping("/upload")
    public ResponseEntity<StoredFileDTO> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        return new ResponseEntity<>(fileStorageService.uploadFile(file, userName), HttpStatus.OK);
    }

    /**
     * Download Endpunkt
     * - Streamt die Datei direkt aus MinIO zum Client
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Integer fileId) throws Exception {
        StoredFileDTO metadata = fileStorageService.getFileMetadata(fileId);
        InputStream stream = fileStorageService.downloadFile(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getMimeType()))
                // Header setzt den Dateinamen fuer den Browser-Download
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + metadata.getFilename() + "\"")
                .body(new InputStreamResource(stream));
    }

    /**
     * Metadaten abrufen (fuer Frontend Dateiliste)
     */
    @GetMapping("/{fileId}")
    public ResponseEntity<StoredFileDTO> getFileMetadata(@PathVariable Integer fileId) {
        return new ResponseEntity<>(fileStorageService.getFileMetadata(fileId), HttpStatus.OK);
    }
}

