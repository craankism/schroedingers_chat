export type ProfilePictureType = {
  url: string;
  userId: number;
  fileId: number;
};

export type ProfilePictureMeta = {
  fileId: number;
  uploadedById: number;
};

export type ProfilePictureInput = {
  file: File;
};
