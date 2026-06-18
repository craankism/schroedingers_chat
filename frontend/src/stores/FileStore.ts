import type {FileInput, FileType} from "../types/FileType.ts";
import {create} from "zustand/react";
import {fileApi} from "../services/apiCalls.ts";
import {useNotificationStore} from "./NotificationStore.ts";

type FileState = {
    files: FileType[],
    error: string | null,
    uploadFile: (fileData: FileInput) => void;
    getFile: (fileId: number) => void;
    getAllFiles: () => void;
    deleteFile: (fileId: number) => void;
}

export const useFileStore = create<FileState>(
    (set) => ({
        files: [],
        error: null,

        uploadFile: async (fileData: FileInput) => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await fileApi.upload(fileData);
                set((state: FileState) => ({
                    files: [...state.files, data]
                }));
                useNotificationStore.getState().addNotification("Datei erfolgreich hochgeladen", "success");
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Hochladen der Datei", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        getFile: async (fileId: number) => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await fileApi.getById(fileId);
                set((state: FileState) => ({
                    files: state.files.map(file => file.fileId === fileId ? {...file, ...data} : file)
                }));
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Laden der Datei", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        getAllFiles: async () => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await fileApi.getAll();
                set({files: data});
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Laden der Dateien", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        deleteFile: async (fileId: number) => {
            useNotificationStore.getState().startLoading();
            try {
                await fileApi.delete(fileId);
                set((state: FileState) => ({
                    files: state.files.filter(file => file.fileId !== fileId)
                }));
                useNotificationStore.getState().addNotification("Datei erfolgreich gelöscht", "success");
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Löschen der Datei", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        }
    })
)