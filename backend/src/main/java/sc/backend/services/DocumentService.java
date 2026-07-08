package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.CreateDocumentDTO;
import sc.backend.dtos.res.DocumentDTO;
import sc.backend.dtos.res.DocumentMetaDTO;
import sc.backend.dtos.res.EditorAuthDTO;
import sc.backend.entities.Document;
import sc.backend.entities.DocumentMembership;
import sc.backend.entities.User;
import sc.backend.enums.DocumentRole;
import sc.backend.exceptions.DocumentPermissionException;
import sc.backend.repositories.DocumentMembershipRepository;
import sc.backend.repositories.DocumentRepository;
import sc.backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentMembershipRepository documentMembershipRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    @Transactional
    public DocumentDTO createDocument(CreateDocumentDTO createDocumentDTO, String authenticatedEmail) {
        User creator = getUserFromEmail(authenticatedEmail);

        Document document = Document.builder()
                .createdAt(LocalDateTime.now())
                .creator(creator)
                .title(createDocumentDTO.getTitle())
                .build();

        Document createdDocument = documentRepository.save(document);

        createdDocument.setName("doc-" + createdDocument.getDocumentId());

        DocumentMembership creatorMembership = DocumentMembership.builder()
                .document(createdDocument)
                .user(creator)
                .role(DocumentRole.OWNER)
                .build();

        documentMembershipRepository.save(creatorMembership);

        for (Integer userId : createDocumentDTO.getDocumentMembershipList()) {
            shareDocument(createdDocument.getDocumentId(), creator.getEmail(), userId);
        }

        return convertToDto(documentRepository.save(createdDocument));
    }

    public List<DocumentMetaDTO> showByUser(String authenticatedEmail) {
        List<DocumentMembership> membershipList = documentMembershipRepository.findByUser(getUserFromEmail(authenticatedEmail));

        List<DocumentMetaDTO> documentMetaDTOList = new ArrayList<>();

        for (DocumentMembership membership : membershipList) {
            documentMetaDTOList.add(convertToMetaDto(membership.getDocument()));
        }

        return documentMetaDTOList;
    }

    @Transactional
    public DocumentMetaDTO shareDocument(int documentId, String authenticatedEmail, int userId) {
        Document document = findDocumentById(documentId);

        checkOwner(document, getUserFromEmail(authenticatedEmail).getUserId());

        User newMember = userService.findUserById(userId);

        if (!documentMembershipRepository.existsByDocumentAndUser(document, newMember)) {
            DocumentMembership documentMembership = DocumentMembership.builder()
                    .document(document)
                    .user(newMember)
                    .role(DocumentRole.EDITOR)
                    .build();
            documentMembershipRepository.save(documentMembership);
        }
        return convertToMetaDto(document);
    }

    @Transactional
    public void deleteDocument(int documentId, String authenticatedEmail) {
        Document document = findDocumentById(documentId);
        checkOwner(document, getUserFromEmail(authenticatedEmail).getUserId());
        List<DocumentMembership> membershipList = document.getDocumentMembershipList();
        documentMembershipRepository.deleteAll(membershipList);
        documentRepository.delete(document);
    }

    public DocumentDTO getDocument(int documentId, String authenticatedEmail) {
        hasAccess(documentId, authenticatedEmail);

        Document document = findDocumentById(documentId);

        return convertToDto(document);
    }

    public EditorAuthDTO hasAccess(int documentId, String authenticatedEmail) {
        User user = getUserFromEmail(authenticatedEmail);
        if (documentMembershipRepository.existsByDocumentAndUser(findDocumentById(documentId), user)) {
            return convertToEditorAuthDTO(user);
        } else {
            throw new DocumentPermissionException("User has no Access to Document");
        }
    }

    private Document findDocumentById(int documentId) {
        return documentRepository.findById(documentId).orElseThrow(() ->
                new EntityNotFoundException("Document not found"));
    }

    private User getUserFromEmail(String authenticatedEmail) {
        return userRepository.findByEmail(authenticatedEmail).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private void checkOwner(Document document, int userId) {
        if (document.getCreator().getUserId() != userId) {
            throw new DocumentPermissionException("User is not Owner, no Permission");
        }
    }

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

    private DocumentMetaDTO convertToMetaDto(Document document) {
        return DocumentMetaDTO.builder()
                .documentId(document.getDocumentId())
                .name(document.getName())
                .title(document.getTitle())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .creator(document.getCreator())
                .build();
    }

    private EditorAuthDTO convertToEditorAuthDTO(User user) {
        return EditorAuthDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .build();
    }

}
