package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sc.backend.dtos.res.StoredFileMetaDTO;
import sc.backend.services.FileStorageService;

import java.io.InputStream;
import java.security.Principal;
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

    @PostMapping("/upload")
    public ResponseEntity<StoredFileMetaDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) Integer folderId, Principal principal) {
        StoredFileMetaDTO storedFileMetaDTO = fileStorageService.uploadFile(file, principal.getName(), folderId);
        broadcastFileUpdate(storedFileMetaDTO.getFileId());
        return new ResponseEntity<>(storedFileMetaDTO, HttpStatus.CREATED);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Integer fileId) {
        StoredFileMetaDTO metadata = fileStorageService.getFileMetadata(fileId);
        InputStream stream = fileStorageService.downloadFile(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + metadata.getFilename() + "\"")
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<StoredFileMetaDTO> getFileMetadata(@PathVariable Integer fileId) {
        return new ResponseEntity<>(fileStorageService.getFileMetadata(fileId), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<StoredFileMetaDTO>> getAllFilesMetadata() {
        return new ResponseEntity<>(fileStorageService.getAllFilesMetaData(), HttpStatus.OK);
    }

    @PatchMapping("/{fileId}/move")
    public ResponseEntity<StoredFileMetaDTO> moveFile(
            @PathVariable int fileId,
            @RequestParam int folderId) {
        StoredFileMetaDTO result = fileStorageService.moveFile(fileId, folderId);
        broadcastFileUpdate(fileId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFileById(@PathVariable int fileId) {
        fileStorageService.deleteFile(fileId);
        broadcastFileUpdate(0);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
