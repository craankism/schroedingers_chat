export type FolderType = {
  folderId: number;
  name: string;
  parentFolderId: number | null;
  createdBy: number;
};

export type FolderInput = {
  name: string;
  parentFolderId: number | null;
};
