import type { JSX } from "@emotion/react/jsx-runtime";
import {
  Box,
  Button,
  Grid,
  IconButton,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { useFileStore } from "../../stores/FileStore.ts";
import { useFolderStore } from "../../stores/FolderStore.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import { widthMinusSidebar } from "../../types/constants/constants.ts";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import NewFolderModal from "../main/files/NewFolderModal.tsx";

const Files = (): JSX.Element => {
  const { uploadFile, downloadFile, deleteFile, files } = useFileStore();
  const { folders } = useFolderStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadFile({
      file: selectedFile,
      folderId: selectedFolder ?? undefined,
    });
    setSelectedFile(null);
  };

  const [openFolderModal, setOpenFolderModal] = useState<boolean>(false);
  const newFolder = () => {
    setOpenFolderModal(true);
  };

  const renderFolder = (folderId: number | null): JSX.Element[] =>
    folders
      .filter((f) => f.parentFolderId === folderId)
      .map((folder) => (
        <TreeItem
          key={folder.id}
          itemId={String(folder.id)}
          label={folder.name}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFolder(folder.id);
          }}
        >
          {renderFolder(folder.id)}
        </TreeItem>
      ));

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, ml: widthMinusSidebar }}
      onClick={() => setSelectedFolder(null)}
    >
      <Toolbar />
      <Typography variant="h5">Files</Typography>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              newFolder();
            }}
          >
            New Folder
          </Button>
          <SimpleTreeView
            selectedItems={
              selectedFolder !== null ? String(selectedFolder) : null
            }
            onSelectedItemsChange={(_, itemId) => {
              if (typeof itemId === "string") {
                setSelectedFolder(Number(itemId));
                return;
              }
              setSelectedFolder(null);
            }}
          >
            {renderFolder(null)}
          </SimpleTreeView>
        </Grid>
        <Grid size={6}>
          <Box
            sx={{ display: "flex", gap: 2, mb: 3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Select File
              <input type="file" hidden onChange={handleSelect} />
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </Box>

          {selectedFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(1)} KB)
            </Typography>
          )}
          {files
            .filter((f) => f.folderId === selectedFolder)
            .map((f) => (
              <ListItem
                key={f.fileId}
                secondaryAction={
                  <>
                    <IconButton
                      onClick={() => downloadFile(f.fileId, f.filename)}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteFile(f.fileId)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <Typography>{f.filename}</Typography>
              </ListItem>
            ))}
        </Grid>
      </Grid>
      {openFolderModal ? (
        <NewFolderModal
          openFolderModal={openFolderModal}
          setOpenFolderModal={setOpenFolderModal}
          subFolder={selectedFolder}
        />
      ) : null}
    </Box>
  );
};

export default Files;
