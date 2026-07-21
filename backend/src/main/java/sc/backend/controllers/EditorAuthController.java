package sc.backend.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sc.backend.dtos.res.EditorAuthDTO;
import sc.backend.services.DocumentService;

import java.security.Principal;

@Tag(name = "Editor", description = "Collaborative editor access control")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/editor/auth")
public class EditorAuthController {

    private final DocumentService documentService;

    @GetMapping("{documentId}")
    public ResponseEntity<EditorAuthDTO> authenticateUser(Principal principal, @PathVariable int documentId) {
        return new ResponseEntity<>(documentService.hasAccess(documentId, principal.getName()), HttpStatus.OK);
    }
}
