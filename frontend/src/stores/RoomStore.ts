import type {RoomInput, RoomType} from "../types/RoomType.ts";
import {create} from "zustand/react";
import {roomApi} from "../services/apiCalls.ts";

type RoomState = {
    rooms: RoomType[];
    error: string | null;
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
            try {
                const data = await roomApi.create(roomData);
                set((state: RoomState) => ({
                    rooms: [...state.rooms, data]
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getRoom: async (roomId: number) => {
            try {
                const data = await roomApi.getById(roomId);
                set((state: RoomState) => ({
                    rooms: state.rooms.map(room => room.roomId === roomId ? {...room, ...data} : room)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getAllRooms: async () => {
            try {
                const data = await roomApi.getAll();
                set({rooms: data})
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        deleteRoom: async (roomId: number) => {
            try {
                await roomApi.delete(roomId);
                set((state: RoomState) => ({
                    rooms: state.rooms.filter(room => room.roomId !== roomId)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        }
    })
)