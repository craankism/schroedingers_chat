package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sc.backend.dtos.req.CreateFolderDTO;
import sc.backend.dtos.res.FolderDTO;
import sc.backend.entities.Folder;
import sc.backend.repositories.FolderRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;

    public FolderDTO createFolder(CreateFolderDTO createFolderDTO) {
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
                .build();

        return convertToDTO(folderRepository.save(folder));
    }

    public List<FolderDTO> getAllFolders() {
        return folderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FolderDTO getFolderById(int id) {
        return convertToDTO(folderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found: " + id)));
    }

    public Folder getById(int id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found: " + id));
    }

    private FolderDTO convertToDTO(Folder folder) {
        return FolderDTO.builder()
                .id(folder.getId())
                .name(folder.getName())
                .parentFolderId(folder.getParentFolder() != null ? folder.getParentFolder().getId() : null)
                .build();
    }
}
