package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/documents")
public class EditorAuthController {

//    GET /api/editor/auth
//    Parameter: token (String), documentName (String)
//
//    Ablauf:
//            1. JWT validieren: Laeuft automatisch durch JwtAuthFilter bevor der Controller-Code ausgefuehrt wird.
//            Der User steht danach im SecurityContext zur Verfuegung.
//
//            2. User aus SecurityContext holen: Wie in euren anderen Controllern, ueber Principal oder Authentication.
//
//            3. documentId extrahieren: documentName ist z.B. "doc-5". Du splittest an "-" und parst den zweiten Teil zu Long.
//
//    4. Dokument laden: documentService.findByName(documentName) oder documentService.findById(documentId).
//    Was auch immer euch eleganter erscheint. Die findByName Variante ist robuster weil der documentName der exakte
//    String aus Hocuspocus ist und ihr euch keine Gedanken ueber das Parsing machen muesst.
//
//            5. Zugriff pruefen: documentService.hasAccess(document, user). Gibt true oder false.
//
//            6a. Bei Erfolg: JSON zurueckgeben mit user_id, email, display_name. HTTP 200.
//
//            6b. Bei Misserfolg: HTTP 403, leerer Body.
//
//    WICHTIG: Dieser Endpoint muss permitAll oder authenticated sein in der SecurityConfig. Wenn ihr /api/** global
//    auf authenticated setzt, greift der JwtAuthFilter automatisch. Prueft aber dass /api/editor/** nicht
//    versehentlich unter permitAll faellt wie /api/file/**.
//
// Rueckgabewert der JSON-Response:
// {
// "user_id": 5,
// "email": "max@example.com",
// "display_name": "Max"
// }
//
// Hocuspocus erwartet diese Felder im onAuthenticate Hook. Die Namen sind nicht fix, aber sie muessen mit dem
// uebereinstimmen was ihr in der index.js im onAuthenticate Hook zurueckgebt. Der Hook gibt aktuell return res.json()
// zurueck, also egal was der Controller liefert, es landet im Hocuspocus-Kontext.


}
