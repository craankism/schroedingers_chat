import type { FolderInput, FolderType } from "../types/FolderType.ts";
import { create } from "zustand/react";
import { folderApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";

type FolderState = {
  folders: FolderType[];
  error: string | null;
  getAllFolders: () => void;
  getFolderById: (id: number) => void;
  createFolder: (folderData: FolderInput) => void;
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
        folders: state.folders.some((f) => f.id === id)
          ? state.folders.map((f) => (f.id === id ? data : f))
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
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error creating folder", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
}));
