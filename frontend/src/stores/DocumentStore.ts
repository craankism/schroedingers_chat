import { create } from "zustand/react";
import { documentApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";
import type { DocumentType } from "src/types/DocumentType.ts";

type DocumentState = {
  documents: DocumentType[];
  currentDocumentId: number;
  setCurrentDocumentId: (id: number) => void;
  error: string | null;
  createDocument: (documentData: DocumentType) => void;
  getDocument: (documentId: number) => Promise<DocumentType | undefined>;
  getAllDocuments: () => void;
  updateDocument: (document: DocumentType, documentId: number) => void;
  deleteDocument: (documentId: number) => void;
};

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  currentDocumentId: 0,
  error: null,

  setCurrentDocumentId(id) {
    set({ currentDocumentId: id });
  },

  createDocument: async (documentData: DocumentType) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await documentApi.create(documentData);
      set((state: DocumentState) => ({
        documents: [...state.documents, data],
      }));
      useNotificationStore
        .getState()
        .addNotification("Document successfully created", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error creating the document", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getDocument: async (documentId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await documentApi.getById(documentId);
      set((state: DocumentState) => ({
        documents: state.documents.map((document) =>
          document.documentId === documentId
            ? { ...document, ...data }
            : document,
        ),
      }));
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading the document", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getAllDocuments: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await documentApi.getAll();
      set({ documents: data });
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading documents", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  updateDocument: async (document: DocumentType, documentId: number) => {
    useNotificationStore.getState().startLoading();
    if (!Array.isArray(document.userList)) {
      const documentStringToArray = JSON.parse("[" + document.userList + "]");
      document.userList = documentStringToArray;
    }

    try {
      const data = await documentApi.update(document, documentId);
      set((state: DocumentState) => ({
        documents: state.documents.map((document) =>
          document.documentId === documentId ? data : document,
        ),
      }));
      useNotificationStore
        .getState()
        .addNotification("Document successfully updated", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error updating document", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  deleteDocument: async (documentId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      await documentApi.delete(documentId);
      set((state: DocumentState) => ({
        documents: state.documents.filter(
          (document) => document.documentId !== documentId,
        ),
      }));
      useNotificationStore
        .getState()
        .addNotification("Document successfully deleted", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error deleting the document", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
}));
