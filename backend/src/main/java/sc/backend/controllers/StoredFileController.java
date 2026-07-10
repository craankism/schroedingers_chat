package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sc.backend.dtos.res.StoredFileMetaDTO;
import sc.backend.services.FileStorageService;

import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api/file")
@Profile("prod")
@RequiredArgsConstructor
public class StoredFileController {

    private final FileStorageService fileStorageService;
    private final WebSocketController webSocketController;

    private void broadcastFileUpdate(int fileId) {
        webSocketController.broadcastUpdate("FILE_UPDATE", fileId);
    }

    /**
     * Upload Endpunkt
     * - Nimmt multipart/form-data entgegen
     * - roomId und userId kommen als RequestParam (spaeter aus JWT)
     */
    @PostMapping("/upload")
    public ResponseEntity<StoredFileMetaDTO> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        StoredFileMetaDTO storedFileMetaDTO = fileStorageService.uploadFile(file, userName);
        broadcastFileUpdate(storedFileMetaDTO.getFileId());
        return new ResponseEntity<>(storedFileMetaDTO, HttpStatus.OK);
    }

    /**
     * Download Endpunkt
     * - Streamt die Datei direkt aus MinIO zum Client
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Integer fileId) throws Exception {
        StoredFileMetaDTO metadata = fileStorageService.getFileMetadata(fileId);
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
    public ResponseEntity<StoredFileMetaDTO> getFileMetadata(@PathVariable Integer fileId) {
        return new ResponseEntity<>(fileStorageService.getFileMetadata(fileId), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<StoredFileMetaDTO>> getAllFilesMetadata() {
        return new ResponseEntity<>(fileStorageService.getAllFilesMetaDate(), HttpStatus.OK);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFileById(@PathVariable int fileId) throws Exception {
        fileStorageService.deleteFile(fileId);
        broadcastFileUpdate(0);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
