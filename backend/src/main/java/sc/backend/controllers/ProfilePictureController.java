package sc.backend.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sc.backend.dtos.res.StoredFileMetaDTO;
import sc.backend.services.ProfilePictureService;

import java.io.InputStream;
import java.security.Principal;
import java.util.List;

@Tag(name = "Profile Pictures", description = "User profile picture upload and download (prod only)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/file/pp")
@Profile("prod")
@RequiredArgsConstructor
public class ProfilePictureController {

    private final ProfilePictureService profilePictureService;
    private final WebSocketController webSocketController;

    private void broadcastFileUpdate(int fileId) {
        webSocketController.broadcastUpdate("PP_UPDATE", fileId);
    }

    @GetMapping
    public ResponseEntity<List<StoredFileMetaDTO>> getAllPicturesMetadata() {
        return ResponseEntity.ok(profilePictureService.getAllFilesMetaData());
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<StoredFileMetaDTO> getPictureMetadata(@PathVariable Integer fileId) {
        return ResponseEntity.ok(profilePictureService.getFileMetadata(fileId));
    }

    @PostMapping("/upload")
    public ResponseEntity<StoredFileMetaDTO> uploadPicture(
            @RequestParam("file") MultipartFile file, Principal principal) {
        StoredFileMetaDTO storedFileMetaDTO = profilePictureService.uploadPicture(file, principal.getName());
        broadcastFileUpdate(storedFileMetaDTO.getFileId());
        return new ResponseEntity<>(storedFileMetaDTO, HttpStatus.CREATED);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<InputStreamResource> downloadPicture(@PathVariable Integer fileId) {
        StoredFileMetaDTO metadata = profilePictureService.getFileMetadata(fileId);
        InputStream stream = profilePictureService.downloadPicture(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + metadata.getFilename() + "\"")
                .body(new InputStreamResource(stream));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFileById(@PathVariable int fileId, Principal principal) {
        profilePictureService.deleteFile(fileId, principal.getName());
        broadcastFileUpdate(0);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
