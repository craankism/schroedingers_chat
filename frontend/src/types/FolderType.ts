export type FolderType = {
  id: number;
  name: string;
  parentFolderId: number | null;
};

export type FolderInput = {
  name: string;
  parentFolderId: number | null;
};
