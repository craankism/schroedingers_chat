import React, { useEffect } from "react";
import type { JSX } from "@emotion/react/jsx-runtime";
import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { useFileStore } from "../../stores/FileStore.ts";
import { useFolderStore } from "../../stores/FolderStore.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import { widthMinusSidebar } from "../../types/constants/constants.ts";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import NewFolderModal from "../main/files/NewFolderModal.tsx";
import { SvgIcon } from "@mui/material";
import DocxSvg from "../../assets/fileIcons/docx_icon.svg?react";
import PDFSvg from "../../assets/fileIcons/PDF_file_icon.svg?react";
import XLSSvg from "../../assets/fileIcons/xlsx_icon.svg?react";
import {
  DescriptionTwoTone,
  FolderOff,
  InsertDriveFileTwoTone,
  InsertPhotoTwoTone,
  Upload,
} from "@mui/icons-material";
import { useSimpleTreeViewApiRef } from "@mui/x-tree-view";
import type { FileType } from "../../types/FileType.ts";
import { useUserStore } from "../../stores/UserStore.ts";
import { decodeJwt } from "../../stores/AuthStore.ts";
import { usePropStore } from "../../stores/PropStore.ts";
import ConfirmationModal from "../main/user_management/ConfirmationModal.tsx";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";

const Files = (): JSX.Element => {
  const { uploadFile, downloadFile, deleteFile, moveFile, files } =
    useFileStore();
  const { folders, deleteFolder } = useFolderStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSelectList, setFileSelectList] = useState<FileType | null>();

  const setSelectedFolder = (id: number | null) => {
    localStorage.setItem("selectedFolder", String(id));
  };

  const lastSelectedFolder = Number(localStorage.getItem("selectedFolder"));
  const [folderSelect, setFolderSelect] = useState<number | null>(
    lastSelectedFolder,
  );

  // Test Files Dummy
  // const files = [
  //   {
  //     fileId: 1,
  //     filename: "project-proposal.pdf",
  //     folderId: 2,
  //     size: 1024,
  //     mimeType: "application/pdf",
  //     uploadedAt: "20.02.2026",
  //     uploadedBy: 1,
  //   },
  //   {
  //     fileId: 2,
  //     filename: "meeting-notes.docx",
  //     folderId: 2,
  //     size: 2048,
  //     mimeType:
  //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     uploadedAt: "20.02.2026",
  //     uploadedBy: 1,
  //   },
  //   {
  //     fileId: 3,
  //     filename: "architecture-diagram.png",
  //     folderId: 2,
  //     size: 4096,
  //     mimeType: "image/png",
  //     uploadedAt: "20.02.2026",
  //     uploadedBy: 1,
  //   },
  //   {
  //     fileId: 4,
  //     filename: "budget-overview.xlsx",
  //     folderId: 2,
  //     size: 3072,
  //     mimeType:
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     uploadedAt: "20.02.2026",
  //     uploadedBy: 1,
  //   },
  //   {
  //     fileId: 5,
  //     filename: "readme.txt",
  //     folderId: 2,
  //     size: 512,
  //     mimeType: "text/plain",
  //     uploadedAt: "20.02.2026",
  //     uploadedBy: 1,
  //   },
  // ];

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    // Reset input so selecting the same file again triggers onChange.
    e.target.value = "";
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadFile({
      file: selectedFile,
      folderId: folderSelect ?? undefined,
    });
    setSelectedFile(null);
  };

  useEffect(() => {
    // eslint-disable-next-line
    if (selectedFile !== null) handleUpload();
    // eslint-disable-next-line
  }, [selectedFile]);

  const [openFolderModal, setOpenFolderModal] = useState<boolean>(false);
  const newFolder = () => {
    setOpenFolderModal(true);
  };

  const DroppableFolder = ({
    folderId,
    name,
    children,
  }: {
    folderId: number;
    name: string;
    children?: React.ReactNode;
  }) => {
    const { ref, isDropTarget } = useDroppable({ id: `droppable-${folderId}` });
    return (
      <TreeItem
        ref={ref}
        itemId={String(folderId)}
        label={name}
        sx={
          isDropTarget
            ? {
                outline: "1px solid",
                outlineColor: "primary.main",
                borderRadius: 1,
              }
            : undefined
        }
        onClick={(e) => {
          e.stopPropagation();
          setSelectedFolder(folderId);
          setFolderSelect(folderId);
          setFileSelectList(null);
        }}
      >
        {children}
      </TreeItem>
    );
  };

  const renderFolder = (parentId: number | null): JSX.Element[] =>
    folders
      .filter((f) => f.parentFolderId === parentId)
      .map((folder) => (
        <DroppableFolder
          key={folder.folderId}
          folderId={folder.folderId}
          name={folder.name}
        >
          {renderFolder(folder.folderId)}
        </DroppableFolder>
      ));

  const iconMap: Record<string, React.ElementType> = {
    pdf: PDFSvg,
    docx: DocxSvg,
    png: InsertPhotoTwoTone,
    jpg: InsertPhotoTwoTone,
    jpeg: InsertPhotoTwoTone,
    gif: InsertPhotoTwoTone,
    svg: InsertPhotoTwoTone,
    txt: DescriptionTwoTone,
    xls: XLSSvg,
    xlsx: XLSSvg,
  };

  const Icon = ({ filename }: { filename: string }): JSX.Element => {
    const fileType = filename.split(".").pop() ?? "";
    const SvgComponent = iconMap[fileType];

    if (!SvgComponent) return <InsertDriveFileTwoTone sx={{ mr: 1 }} />;

    return <SvgIcon component={SvgComponent} inheritViewBox sx={{ mr: 1 }} />;
  };

  const apiRef = useSimpleTreeViewApiRef();

  const handleCollapseClick = () => {
    if (folderSelect === null) return;
    for (let i: number = 1; i < folderSelect; i++) {
      apiRef.current!.setItemExpansion({
        itemId: "" + i,
        shouldBeExpanded: true,
      });
    }
  };

  useEffect(() => {
    handleCollapseClick();
    // eslint-disable-next-line
  }, [folderSelect]);

  const { users } = useUserStore();
  const isFileCreator = decodeJwt()?.userId === fileSelectList?.uploadedById;
  const currentUserId = decodeJwt()?.userId;
  const getAllSubfolderIds = (folderId: number): number[] => {
    const children = folders.filter((f) => f.parentFolderId === folderId);
    return children.flatMap((c) => [
      c.folderId,
      ...getAllSubfolderIds(c.folderId),
    ]);
  };
  const isFolderCreator = (() => {
    if (folderSelect === null) return false;
    const selected = folders.find((f) => f.folderId === folderSelect);
    if (selected?.createdBy !== currentUserId) return false;
    const subfolderIds = getAllSubfolderIds(folderSelect);
    return subfolderIds.every(
      (id) =>
        folders.find((f) => f.folderId === id)?.createdBy === currentUserId,
    );
  })();
  const isAdmin = users.find((user) => user.userId === currentUserId)?.isAdmin;

  const { confirmation, setConfirmation, setOpenConfirmation } = usePropStore();
  const [deleteF, setDeleteF] = useState<boolean>(false);

  React.useEffect(() => {
    if (confirmation == true && deleteF === true && folderSelect) {
      deleteFolder(folderSelect);
      setConfirmation(false);
      // eslint-disable-next-line
      setDeleteF(false);
      setFolderSelect(null);
    }
    // eslint-disable-next-line
  }, [confirmation]);

  const DraggableFile = ({ f }: { f: FileType }) => {
    const isOwner = f.uploadedById === decodeJwt()?.userId;
    const { ref } = useDraggable({
      id: `draggable-${f.fileId}`,
      data: { fileId: f.fileId },
      disabled: !isOwner && !isAdmin,
    });
    return (
      <ListItem ref={ref}>
        <ListItemButton
          selected={fileSelectList?.fileId === f.fileId}
          onClick={(e) => {
            e.stopPropagation();
            setFileSelectList(f);
          }}
        >
          <Icon filename={f.filename} />
          <Typography>{f.filename}</Typography>
        </ListItemButton>
      </ListItem>
    );
  };

  const handleDragEnd = ({
    operation,
  }: {
    operation: {
      source: { data: unknown } | null;
      target: { id: string | number } | null;
    };
  }) => {
    const { source, target } = operation;
    if (!source || !target) return;
    const fileId = (source.data as { fileId: number }).fileId;
    const folderId = Number(String(target.id).replace("droppable-", ""));
    if (fileId && folderId) moveFile(fileId, folderId);
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: widthMinusSidebar }}>
        <Toolbar />
        <Typography variant="h5">Files</Typography>

        <Grid container sx={{ height: "85vh" }}>
          <Grid
            size={4}
            sx={{ border: "1px solid" }}
            onClick={() => {
              setSelectedFolder(null);
              setFolderSelect(null);
              setFileSelectList(null);
            }}
          >
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
              apiRef={apiRef}
              expansionTrigger="iconContainer"
              selectedItems={
                folderSelect !== null ? String(folderSelect) : null
              }
            >
              {renderFolder(null)}
            </SimpleTreeView>
          </Grid>
          <Grid size={8}>
            <Box
              onClick={() => setFileSelectList(null)}
              sx={{
                height: "85vh",
                borderBottom: "1px solid",
                borderRight: "1px solid",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  ml: -1,
                  border: "solid, 1px",
                  borderRight: "none",
                  height: 39.5,
                }}
              >
                <IconButton component="label" sx={{ ml: 2 }}>
                  <Upload />
                  <input type="file" hidden onChange={handleSelect} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (fileSelectList === undefined || fileSelectList === null)
                      return;
                    downloadFile(
                      fileSelectList.fileId,
                      fileSelectList.filename,
                    );
                  }}
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  disabled={
                    (!isAdmin && !isFileCreator) || fileSelectList === null
                  }
                  onClick={() => {
                    if (fileSelectList === undefined || fileSelectList === null)
                      return;
                    deleteFile(fileSelectList.fileId);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  disabled={
                    (!isAdmin && !isFolderCreator) || folderSelect === null
                  }
                  onClick={() => {
                    if (folderSelect === null) return;
                    setOpenConfirmation(true);
                    setDeleteF(true);
                  }}
                >
                  <FolderOff />
                </IconButton>
              </Box>
              <List onClick={() => setFileSelectList(null)}>
                {files
                  .filter((f) => f.folderId === folderSelect)
                  .map((f) => (
                    <DraggableFile key={f.fileId} f={f} />
                  ))}
              </List>
            </Box>
          </Grid>
        </Grid>
        {openFolderModal ? (
          <NewFolderModal
            openFolderModal={openFolderModal}
            setOpenFolderModal={setOpenFolderModal}
            setFolderSelect={setFolderSelect}
          />
        ) : null}
        <ConfirmationModal />
      </Box>
    </DragDropProvider>
  );
};

export default Files;
