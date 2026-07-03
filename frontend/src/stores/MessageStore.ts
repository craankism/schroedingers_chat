import type { MessageInput, MessageType } from "../types/MessageType.ts";
import { create } from "zustand/react";
import { messageApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";

type MessageState = {
  messages: MessageType[];
  error: string | null;
  postMessage: (messageData: MessageInput) => void;
  // getMessage: (messageId: number) => void;
  getAllMessages: () => void;
  deleteMessage: (messageId: number) => void;
};

export const useMessageStore = create<MessageState>((set) => ({
  // not needed?
  messages: [],

  error: null,

  // not needed?
  postMessage: async (messageData: MessageInput) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await messageApi.post(messageData);
      set((state: MessageState) => ({
        messages: [...state.messages, data],
      }));
      useNotificationStore
        .getState()
        .addNotification("Message successfully sent", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error sending message", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  // not needed?
  //   getMessage: async (messageId: number) => {
  //       useNotificationStore.getState().startLoading();
  //       try {
  //           const data = await messageApi.getById(messageId);
  //           set((state: MessageState) => ({
  //               messages: state.messages.map(msg => msg.messageId === messageId ? {...msg, ...data} : msg)
  //           }));
  //       } catch (e) {
  //           set({error: "Fehler" + e});
  //           useNotificationStore.getState().addNotification("Fehler beim Laden der Nachricht", "error");
  //       } finally {
  //           useNotificationStore.getState().stopLoading();
  //       }
  //   },

  getAllMessages: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await messageApi.getAll();
      set({ messages: data });
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading messages", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  deleteMessage: async (messageId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      await messageApi.delete(messageId);
      useNotificationStore
        .getState()
        .addNotification("Message successfully deleted", "success");
    } catch (e) {
      set({ error: "Fehler" + e });
      useNotificationStore
        .getState()
        .addNotification("Error deleting message", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
}));
