import type { FileInput } from "../types/FileType.ts";
import { create } from "zustand/react";
import { ppApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";
import type { ProfilePictureType } from "../types/ProfilePictureType.ts";
import { decodeJwt } from "./AuthStore.ts";

type FileState = {
  profilePictures: ProfilePictureType[];
  error: string | null;
  uploadProfilePicture: (fileData: FileInput) => Promise<void>;
  getProfilePicture: (fileId: number) => Promise<string | undefined>;
  getAllProfilePictures: () => Promise<void>;
  deleteProfilePicture: (fileId: number) => Promise<void>;
};

export const useProfilePictureStore = create<FileState>((set, get) => ({
  profilePictures: [],
  error: null,

  uploadProfilePicture: async (fileData: FileInput) => {
    useNotificationStore.getState().startLoading();
    try {
      const currentUserId = decodeJwt()?.userId;
      if (currentUserId !== undefined) {
        const existing = get().profilePictures.find(
          (p) => p.userId === currentUserId,
        );
        if (existing) {
          await ppApi.delete(existing.fileId);
        }
      }
      const meta = await ppApi.upload(fileData);
      const blob = await ppApi.download(meta.fileId);
      const url = window.URL.createObjectURL(blob);
      set((state: FileState) => ({
        profilePictures: [
          ...state.profilePictures.filter(
            (p) => p.userId !== meta.uploadedById,
          ),
          { url, userId: meta.uploadedById, fileId: meta.fileId },
        ],
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

  getProfilePicture: async (fileId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      const [meta, blob] = await Promise.all([
        ppApi.getMeta(fileId),
        ppApi.download(fileId),
      ]);
      const url = window.URL.createObjectURL(blob);
      set((state: FileState) => ({
        profilePictures: [
          ...state.profilePictures.filter((p) => p.fileId !== fileId),
          { url, userId: meta.uploadedById, fileId },
        ],
      }));
      return url;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error during download", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getAllProfilePictures: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const metas = await ppApi.getAll();
      const pictures = await Promise.all(
        metas.map(async (meta) => {
          const blob = await ppApi.download(meta.fileId);
          const url = window.URL.createObjectURL(blob);
          return { url, userId: meta.uploadedById, fileId: meta.fileId };
        }),
      );
      set({ profilePictures: pictures });
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading Profile Pictures", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  deleteProfilePicture: async (fileId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      await ppApi.delete(fileId);
      set((state: FileState) => ({
        profilePictures: state.profilePictures.filter(
          (file) => file.fileId !== fileId,
        ),
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
