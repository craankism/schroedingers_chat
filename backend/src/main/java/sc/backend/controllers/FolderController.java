package sc.backend.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.CreateFolderDTO;
import sc.backend.dtos.res.FolderDTO;
import sc.backend.services.FolderService;

import java.security.Principal;
import java.util.List;

@Tag(name = "Folders", description = "File folder management")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/folder")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;
    private final WebSocketController webSocketController;

    private void broadcastFolderUpdate(int folderId) {
        webSocketController.broadcastUpdate("FOLDER_UPDATE", folderId);
    }

    @PostMapping
    public ResponseEntity<FolderDTO> createFolder(@RequestBody CreateFolderDTO createFolderDTO, Principal principal) {
        FolderDTO folder = folderService.createFolder(createFolderDTO, principal.getName());
        broadcastFolderUpdate(folder.getFolderId());
        return new ResponseEntity<>(folder, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FolderDTO>> getAllFolders() {
        return ResponseEntity.ok(folderService.getAllFolders());
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<FolderDTO> getFolderById(@PathVariable int folderId, Principal principal) {
        return ResponseEntity.ok(folderService.getFolderById(folderId, principal.getName()));
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<?> deleteFileById(@PathVariable int folderId, Principal principal) {
        folderService.deleteFolder(folderId, principal.getName());
        broadcastFolderUpdate(0);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
