package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.CreateDocumentDTO;
import sc.backend.dtos.req.UpdateDocumentDTO;
import sc.backend.dtos.res.DocumentDTO;
import sc.backend.dtos.res.DocumentMetaDTO;
import sc.backend.dtos.res.EditorAuthDTO;
import sc.backend.entities.Document;
import sc.backend.entities.DocumentMembership;
import sc.backend.entities.User;
import sc.backend.enums.DocumentRole;
import sc.backend.exceptions.PermissionException;
import sc.backend.repositories.DocumentMembershipRepository;
import sc.backend.repositories.DocumentRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentMembershipRepository documentMembershipRepository;
    private final UserService userService;

    @Transactional
    public DocumentDTO createDocument(CreateDocumentDTO createDocumentDTO, String authenticatedEmail) {
        User creator = userService.findUserByEmail(authenticatedEmail);

        Document createdDocument = Document.builder()
                .createdAt(LocalDateTime.now())
                .creator(creator)
                .title(createDocumentDTO.getTitle())
                .build();

        documentRepository.saveAndFlush(createdDocument);

        DocumentMembership creatorMembership = DocumentMembership.builder()
                .document(createdDocument)
                .user(creator)
                .role(DocumentRole.OWNER)
                .build();

        documentMembershipRepository.saveAndFlush(creatorMembership);

        for (Integer userId : createDocumentDTO.getDocumentMembershipList()) {
            addMember(createdDocument, userId);
        }

        return convertToDto(createdDocument);
    }

    @Transactional
    public List<DocumentMetaDTO> showByUser(String authenticatedEmail) {
        List<DocumentMembership> membershipList = documentMembershipRepository.findByUser(userService.findUserByEmail(authenticatedEmail));

        List<DocumentMetaDTO> documentMetaDTOList = new ArrayList<>();

        for (DocumentMembership membership : membershipList) {
            documentMetaDTOList.add(convertToMetaDto(membership.getDocument()));
        }

        return documentMetaDTOList;
    }

    @Transactional
    public DocumentMetaDTO shareDocument(int documentId, String authenticatedEmail, int userId) {
        Document document = findDocumentById(documentId);
        checkOwner(document, userService.findUserByEmail(authenticatedEmail).getUserId());
        addMember(document, userId);
        return convertToMetaDto(document);
    }

    @Transactional
    public void deleteDocument(int documentId, String authenticatedEmail) {
        Document document = findDocumentById(documentId);
        checkOwner(document, userService.findUserByEmail(authenticatedEmail).getUserId());
        List<DocumentMembership> membershipList = documentMembershipRepository.findByDocument(document);
        documentMembershipRepository.deleteAll(membershipList);
        documentRepository.delete(document);
    }

    @Transactional
    public DocumentDTO getDocument(int documentId, String authenticatedEmail) {
        hasAccess(documentId, authenticatedEmail);

        Document document = findDocumentById(documentId);

        return convertToDto(document);
    }

    @Transactional
    public DocumentDTO updateDocument(int documentId, UpdateDocumentDTO updateDocumentDTO, String authenticatedEmail) {
        User user = userService.findUserByEmail(authenticatedEmail);
        Document document = findDocumentById(documentId);

        checkOwner(document, user.getUserId());

        document.setTitle(updateDocumentDTO.getTitle());
        document.setUpdatedAt(LocalDateTime.now());

        List<DocumentMembership> currentMemberships = documentMembershipRepository.findByDocument(document);
        List<Integer> newMemberIds = updateDocumentDTO.getDocumentMembershipList();

        for (DocumentMembership membership : currentMemberships) {
            if (!newMemberIds.contains(membership.getUser().getUserId())) {
                if (membership.getUser().getUserId() != document.getCreator().getUserId()) {
                    documentMembershipRepository.delete(membership);
                }
            }
        }

        for (Integer userId : newMemberIds) {
            if (currentMemberships.stream().noneMatch(m -> m.getUser().getUserId() == userId)) {
                addMember(document, userId);
            }
        }

        documentRepository.save(document);
        return convertToDto(document);
    }

    @Transactional
    public EditorAuthDTO hasAccess(int documentId, String authenticatedEmail) {
        User user = userService.findUserByEmail(authenticatedEmail);
        if (documentMembershipRepository.existsByDocumentAndUser(findDocumentById(documentId), user)) {
            return convertToEditorAuthDTO(user);
        } else {
            throw new PermissionException("User has no Access to Document");
        }
    }

    private void addMember(Document document, int userId) {
        User newMember = userService.findUserById(userId);

        if (!documentMembershipRepository.existsByDocumentAndUser(document, newMember)) {
            DocumentMembership membership = DocumentMembership.builder()
                    .document(document)
                    .user(newMember)
                    .role(DocumentRole.EDITOR)
                    .build();
            documentMembershipRepository.saveAndFlush(membership);
        }
    }

    private Document findDocumentById(int documentId) {
        return documentRepository.findById(documentId).orElseThrow(() ->
                new EntityNotFoundException("Document not found"));
    }

    private List<Integer> getMembershipList(Document document) {
        return documentMembershipRepository.findByDocument(document)
                .stream()
                .map(dm -> dm.getUser().getUserId())
                .collect(Collectors.toList());
    }

    private void checkOwner(Document document, int userId) {
        if (document.getCreator().getUserId() != userId) {
            throw new PermissionException("User is not Owner, no Permission");
        }
    }

    private DocumentDTO convertToDto(Document document) {

        return DocumentDTO.builder()
                .documentId(document.getDocumentId())
                .title(document.getTitle())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .content(document.getContent())
                .creatorId(document.getCreator().getUserId())
                .documentMembershipList(getMembershipList(document))
                .build();
    }

    private DocumentMetaDTO convertToMetaDto(Document document) {
        return DocumentMetaDTO.builder()
                .documentId(document.getDocumentId())
                .title(document.getTitle())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .creatorId(document.getCreator().getUserId())
                .documentMembershipList(getMembershipList(document))
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
