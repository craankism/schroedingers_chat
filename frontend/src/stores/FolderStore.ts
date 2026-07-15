import type { FolderInput, FolderType } from "../types/FolderType.ts";
import { create } from "zustand/react";
import { folderApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";

type FolderState = {
  folders: FolderType[];
  error: string | null;
  getAllFolders: () => void;
  getFolderById: (id: number) => void;
  createFolder: (folderData: FolderInput) => Promise<FolderType | null>;
  deleteFolder: (folderId: number) => Promise<void>;
};

export const useFolderStore = create<FolderState>((set) => ({
  folders: [],
  error: null,

  getAllFolders: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await folderApi.getAll();
      set({ folders: data });
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading folders", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getFolderById: async (id: number) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await folderApi.getById(id);
      set((state: FolderState) => ({
        folders: state.folders.some((f) => f.folderId === id)
          ? state.folders.map((f) => (f.folderId === id ? data : f))
          : [...state.folders, data],
      }));
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading folder", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  createFolder: async (folderData: FolderInput) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await folderApi.create(folderData);
      set((state: FolderState) => ({ folders: [...state.folders, data] }));
      useNotificationStore
        .getState()
        .addNotification("Folder created", "success");
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error creating folder", "error");
      return null;
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  deleteFolder: async (folderId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      await folderApi.delete(folderId);
      set((state: FolderState) => ({
        folders: state.folders.filter((folder) => folder.folderId !== folderId),
      }));
      useNotificationStore
        .getState()
        .addNotification("Folder successfully deleted", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error deleting folder", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
}));
