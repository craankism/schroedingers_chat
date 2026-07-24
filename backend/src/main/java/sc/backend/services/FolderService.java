package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import sc.backend.dtos.req.CreateFolderDTO;
import sc.backend.dtos.res.FolderDTO;
import sc.backend.entities.Folder;
import sc.backend.entities.User;
import sc.backend.exceptions.FolderNotFoundException;
import sc.backend.exceptions.PermissionException;
import sc.backend.repositories.FolderRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final UserService userService;

    public FolderDTO createFolder(CreateFolderDTO createFolderDTO, String authenticatedEmail) {
        User creator = userService.findUserByEmail(authenticatedEmail);

        Folder parent = null;
        if (createFolderDTO.getParentFolderId() != null) {
            parent = folderRepository.findById(createFolderDTO.getParentFolderId())
                    .orElseThrow(
                            () -> new IllegalArgumentException(
                                    "Parent folder not found: " + createFolderDTO.getParentFolderId()));
        }

        Folder folder = Folder.builder()
                .name(createFolderDTO.getName())
                .parentFolder(parent)
                .creator(creator)
                .build();

        return convertToDTO(folderRepository.save(folder));
    }

    public List<FolderDTO> getAllFolders() {
        return folderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FolderDTO getFolderById(int id, String authenticatedEmail) {
        return convertToDTO(folderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found: " + id)));
    }

    public void deleteFolder(Integer folderId, String authenticatedEmail) {
        User caller = userService.findUserByEmail(authenticatedEmail);
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new FolderNotFoundException("Folder not found: " + folderId));

        if (folder.getCreator().getUserId() != caller.getUserId()) {
            throw new PermissionException("You do not have permission to delete this folder");
        }

        folderRepository.delete(folder);
    }

    private FolderDTO convertToDTO(Folder folder) {
        return FolderDTO.builder()
                .folderId(folder.getFolderId())
                .name(folder.getName())
                .parentFolderId(folder.getParentFolder() != null ? folder.getParentFolder().getFolderId() : null)
                .createdBy(folder.getCreator().getUserId())
                .build();
    }
}
