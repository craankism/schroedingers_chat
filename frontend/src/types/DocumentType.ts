export type DocumentType = {
  documentId?: number;
  title: string;
  createdBy?: number;
  documentMembershipList: number[];
  content?: string;
};
