export type FileType = {
  fileId: number;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedById: number;
  folderId: number | null;
};

export type FileInput = {
  file: File;
  folderId?: number;
};
