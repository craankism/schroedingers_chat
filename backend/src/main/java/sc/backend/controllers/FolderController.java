package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.CreateFolderDTO;
import sc.backend.dtos.res.FolderDTO;
import sc.backend.services.FolderService;

import java.util.List;

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
    public ResponseEntity<FolderDTO> createFolder(@RequestBody CreateFolderDTO createFolderDTO) {
        FolderDTO folder = folderService.createFolder(createFolderDTO);
        broadcastFolderUpdate(folder.getId());
        return new ResponseEntity<>(folder, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FolderDTO>> getAllFolders() {
        return ResponseEntity.ok(folderService.getAllFolders());
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<FolderDTO> getFolderById(@PathVariable int folderId) {
        return ResponseEntity.ok(folderService.getFolderById(folderId));
    }
}
