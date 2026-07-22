import type { RoomInput, RoomType } from "../types/RoomType.ts";
import { create } from "zustand/react";
import { roomApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";

type RoomState = {
  rooms: RoomType[];
  error: string | null;
  createRoom: (roomData: RoomInput) => Promise<RoomType>;
  getRoom: (roomId: number) => Promise<RoomType | undefined>;
  getAllRooms: () => void;
  updateRoom: (room: RoomInput, roomId: number) => void;
  deleteRoom: (roomId: number) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  error: null,

  createRoom: async (roomData: RoomInput) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await roomApi.create(roomData);
      set((state: RoomState) => ({
        rooms: [...state.rooms, data],
      }));
      useNotificationStore
        .getState()
        .addNotification("Room successfully created", "success");
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error creating the room", "error");
      throw e;
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getRoom: async (roomId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await roomApi.getById(roomId);
      set((state: RoomState) => ({
        rooms: state.rooms.map((room) =>
          room.roomId === roomId ? { ...room, ...data } : room,
        ),
      }));
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading the room", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getAllRooms: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await roomApi.getAll();
      set({ rooms: data });
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading rooms", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  updateRoom: async (room: RoomInput, roomId: number) => {
    useNotificationStore.getState().startLoading();
    if (!Array.isArray(room.userIdSet)) {
      const roomStringToArray = JSON.parse("[" + room.userIdSet + "]");
      room.userIdSet = roomStringToArray;
    }

    try {
      const data = await roomApi.update(room, roomId);
      set((state: RoomState) => ({
        rooms: state.rooms.map((room) =>
          room.roomId === roomId ? data : room,
        ),
      }));
      useNotificationStore
        .getState()
        .addNotification("Room successfully updated", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error updating Room", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  deleteRoom: async (roomId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      await roomApi.delete(roomId);
      set((state: RoomState) => ({
        rooms: state.rooms.filter((room) => room.roomId !== roomId),
      }));
      useNotificationStore
        .getState()
        .addNotification("Room successfully deleted", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error deleting the room", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
}));
