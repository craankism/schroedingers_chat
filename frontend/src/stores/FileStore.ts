import type { FileInput, FileType } from "../types/FileType.ts";
import { create } from "zustand/react";
import { fileApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";

type FileState = {
  files: FileType[];
  error: string | null;
  uploadFile: (fileData: FileInput) => void;
  downloadFile: (fileId: number, fileName: string) => void;
  getFileMeta: (fileId: number) => void;
  getAllFilesMeta: () => void;
  deleteFile: (fileId: number) => void;
};

export const useFileStore = create<FileState>((set) => ({
  files: [],
  error: null,

  uploadFile: async (fileData: FileInput) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await fileApi.upload(fileData);
      set((state: FileState) => ({
        files: [...state.files, data],
      }));
      useNotificationStore
        .getState()
        .addNotification("File successfully uploaded", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error uploading file", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  downloadFile: async (fileId: number, fileName: string) => {
    useNotificationStore.getState().startLoading();
    try {
      const blob = await fileApi.download(fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      useNotificationStore
        .getState()
        .addNotification("Download started", "success");
    } catch (e) {
      set({ error: "Fehler" + e });
      useNotificationStore
        .getState()
        .addNotification("Error during download", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getFileMeta: async (fileId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await fileApi.getByIdMeta(fileId);
      set((state: FileState) => ({
        files: state.files.map((file) =>
          file.fileId === fileId ? { ...file, ...data } : file,
        ),
      }));
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading file", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getAllFilesMeta: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await fileApi.getAllMeta();
      set({ files: data });
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading files", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  deleteFile: async (fileId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      await fileApi.delete(fileId);
      set((state: FileState) => ({
        files: state.files.filter((file) => file.fileId !== fileId),
      }));
      useNotificationStore
        .getState()
        .addNotification("File successfully deleted", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error deleting file", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
}));
