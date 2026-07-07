package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.CreateDocumentDTO;
import sc.backend.dtos.res.DocumentDTO;
import sc.backend.entities.Document;
import sc.backend.entities.DocumentMembership;
import sc.backend.entities.User;
import sc.backend.enums.DocumentRole;
import sc.backend.repositories.DocumentMembershipRepository;
import sc.backend.repositories.DocumentsRepository;
import sc.backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentsRepository documentsRepository;
    private final DocumentMembershipRepository documentMembershipRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public DocumentDTO createDocument(CreateDocumentDTO createDocumentDTO, String authenticatedEmail) {
        User creator = userService.getUserByEmail(userRepository.findByEmail(authenticatedEmail));

        Document document = Document.builder()
                .createdAt(LocalDateTime.now())
                .creator(creator)
                .title(createDocumentDTO.getTitle())
                .build();

        Document createdDocument = documentsRepository.save(document);

        createdDocument.setName("doc-" + createdDocument.getDocumentId());

        DocumentMembership creatorMembership = DocumentMembership.builder()
                .document(createdDocument)
                .user(creator)
                .role(DocumentRole.OWNER)
                .build();

        documentMembershipRepository.save(creatorMembership);

        for (Integer userId: createDocumentDTO.getDocumentMembershipList()) {
            shareDocument(createdDocument.getDocumentId(), creator.getUserId(), userId);
        }

        return convertToDto(documentsRepository.save(createdDocument));
    }

    public List<DocumentDTO> showByUser(int userId) {
        User user = userRepository.findById(userId).orElseThrow();

        List<DocumentMembership> membershipList = documentMembershipRepository.findByUser(user);

        List<DocumentDTO> documentDTOList = new ArrayList<>();

        for (DocumentMembership membership: membershipList) {
            documentDTOList.add(convertToDto(membership.getDocument()));
        }

        return documentDTOList;
    }

    public void shareDocument(Long documentId, int ownerId, int userId) {
        Document document = documentsRepository.findById(documentId);
        User owner = userRepository.getById(ownerId);

        if (document.getCreator() != owner) {
            throw new RuntimeException("User is not Owner, no Permission");
        }

        User newMember = userRepository.getById(userId);

        DocumentMembership documentMembership = DocumentMembership.builder()
                .document(document)
                .user(newMember)
                .role(DocumentRole.EDITOR)
                .build();

        documentMembershipRepository.save(documentMembership);
    }

    public void deleteDocument(Long documentId, int ownerId) {
        Document document = documentsRepository.findById(documentId);
        User owner = userRepository.getById(ownerId);

        if (document.getCreator() != owner) {
            throw new RuntimeException("User is not Owner, no Permission");
        }

        List<DocumentMembership> membershipList = document.getDocumentMembershipList();



        documentMembershipRepository.deleteAllById(documentMembershipRepository.findByDocument(document));
    }

    // CREATE: Neues Dokument erstellen
    // - Generiert name ("doc-" + documentId nach save)
    // - Setzt Owner
    // - Erstellt automatisch eine DocumentMembership mit Role OWNER

    // LIST: Alle Dokumente eines Users
    // - Sucht alle DocumentMemberships des Users
    // - Gibt Dokumenttitel, Rolle, updatedAt zurueck

    // SHARE: Dokument mit User teilen
    // - Sucht Dokument anhand documentId
    // - Prueft ob anfragender User OWNER ist
    // - Sucht Ziel-User anhand Email
    // - Erstellt DocumentMembership mit Role EDITOR

    // DELETE: Dokument loeschen
    // - Prueft ob User OWNER ist
    // - Loescht alle Memberships
    // - Loescht Dokument

    // GET_CONTENT: Dokumentinhalt laden (fuer Export spaeter)

    // HAS_ACCESS: Prueft ob User Zugriff auf Dokument hat
    // - Wird vom EditorAuthController genutzt


    private DocumentDTO convertToDto(Document document) {
        return DocumentDTO.builder()
                .documentId(document.getDocumentId())
                .name(document.getName())
                .title(document.getTitle())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .content(document.getContent())
                .creator(document.getCreator())
                .build();
    }

}
