import type {RoomInput, RoomType} from "../types/RoomType.ts";
import {create} from "zustand/react";
import {roomApi} from "../services/apiCalls.ts";
import {useNotificationStore} from "./NotificationStore.ts";

type RoomState = {
    rooms: RoomType[],
    error: string | null,
    createRoom: (roomData: RoomInput) => void;
    getRoom: (roomId: number) => void;
    getAllRooms: () => void;
    deleteRoom: (roomId: number) => void;
}

export const useRoomStore = create<RoomState>(
    (set) => ({
        rooms: [],
        error: null,

        createRoom: async (roomData: RoomInput) => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await roomApi.create(roomData);
                set((state: RoomState) => ({
                    rooms: [...state.rooms, data]
                }));
                useNotificationStore.getState().addNotification("Raum erfolgreich erstellt", "success");
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Erstellen des Raums", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        getRoom: async (roomId: number) => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await roomApi.getById(roomId);
                set((state: RoomState) => ({
                    rooms: state.rooms.map(room => room.roomId === roomId ? {...room, ...data} : room)
                }));
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Laden des Raums", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        getAllRooms: async () => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await roomApi.getAll();
                set({rooms: data});
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Laden der Räume", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        deleteRoom: async (roomId: number) => {
            useNotificationStore.getState().startLoading();
            try {
                await roomApi.delete(roomId);
                set((state: RoomState) => ({
                    rooms: state.rooms.filter(room => room.roomId !== roomId)
                }));
                useNotificationStore.getState().addNotification("Raum erfolgreich gelöscht", "success");
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Löschen des Raums", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        }
    })
)