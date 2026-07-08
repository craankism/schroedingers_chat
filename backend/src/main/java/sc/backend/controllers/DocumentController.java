package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.CreateDocumentDTO;
import sc.backend.dtos.res.DocumentDTO;
import sc.backend.dtos.res.DocumentMetaDTO;
import sc.backend.services.DocumentService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    public ResponseEntity<DocumentDTO> createDocument(@RequestBody CreateDocumentDTO createDocumentDTO, Principal principal) {
        return new ResponseEntity<>(documentService.createDocument(createDocumentDTO, principal.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DocumentMetaDTO>> showDocumentsByUser(Principal principal) {
        return new ResponseEntity<>(documentService.showByUser(principal.getName()), HttpStatus.OK);
    }

    @GetMapping("{documentId}")
    public ResponseEntity<DocumentDTO> getDocument(@PathVariable int documentId, Principal principal) {
        return new ResponseEntity<>(documentService.getDocument(documentId, principal.getName()), HttpStatus.OK);
    }

    @PostMapping("{documentId}/share/{userId}")
    public ResponseEntity<DocumentMetaDTO> shareDocument(@PathVariable int documentId, @PathVariable int userId, Principal principal) {
        return new ResponseEntity<>(documentService.shareDocument(documentId, principal.getName(), userId), HttpStatus.OK);
    }

    @DeleteMapping("{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable int documentId, Principal principal) {
        documentService.deleteDocument(documentId, principal.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
