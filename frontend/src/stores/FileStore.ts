import type { FileInput, FileType } from "../types/FileType.ts";
import { create } from "zustand/react";
import { fileApi } from "../services/apiCalls.ts";

type FileState = {
    files: FileType[];
    error: string | null;
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
            try {
                const data = await fileApi.upload(fileData);
                set((state: FileState) => ({
                    files: [...state.files, data]
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getFile: async (fileId: number) => {
            try {
                const data = await fileApi.getById(fileId);
                set((state: FileState) => ({
                    files: state.files.map(file => file.fileId === fileId ? {...file, ...data} : file)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getAllFiles: async () => {
            try {
                const data = await fileApi.getAll();
                set({files: data})
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        deleteFile: async (fileId: number) => {
            try {
                await fileApi.delete(fileId);
                set((state: FileState) => ({
                    files: state.files.filter(file => file.fileId !== fileId)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        }
    })
)