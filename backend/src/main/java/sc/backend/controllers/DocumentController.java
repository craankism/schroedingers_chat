package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

//    POST   /api/documents              -> Neues Dokument erstellen
//    Body: { "title": "Mein Dokument" }
//    Response: { "documentId": 5, "name": "doc-5", "title": "Mein Dokument" }
//
//    GET    /api/documents              -> Alle Dokumente des Users listen
//    Response: [{ "documentId": 5, "title": "...", "role": "OWNER", "updatedAt": "..." }, ...]
//
//    GET    /api/documents/{id}         -> Details fuer ein Dokument
//    Response: { "documentId": 5, "title": "...", "role": "OWNER", "members": [...] }
//
//    POST   /api/documents/{id}/share   -> Dokument teilen
//    Body: { "email": "kollege@example.com", "role": "EDITOR" }
//    Response: 200 OK oder 403 Forbidden
//
//    DELETE /api/documents/{id}         -> Dokument loeschen
//    Response: 204 No Content oder 403 Forbidden

}
