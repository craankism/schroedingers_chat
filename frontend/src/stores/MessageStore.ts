import type { MessageInput } from "../types/MessageType.ts";
import { create } from "zustand/react";
import { messageApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";

type MessageState = {
  messages: MessageInput[];
  hasMore: boolean;
  error: string | null;
  // postMessage: (messageData: MessageInput) => void;
  getFiftyMessages: (
    messageId: number,
    index: number,
  ) => Promise<MessageInput[]>;
  // getAllMessages: () => void;
  setMessages: (message: MessageInput) => void;
  markMessageDeleted: (messageId: number) => void;
  // deleteMessage: (messageId: number) => void;
};

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  hasMore: true,
  error: null,

  // not needed?
  // postMessage: async (messageData: MessageInput) => {
  //   useNotificationStore.getState().startLoading();
  //   try {
  //     const data = await messageApi.post(messageData);
  //     set((state: MessageState) => ({
  //       messages: [...state.messages, data],
  //     }));
  //     useNotificationStore
  //       .getState()
  //       .addNotification("Message successfully sent", "success");
  //   } catch (e) {
  //     set({ error: "Error" + e });
  //     useNotificationStore
  //       .getState()
  //       .addNotification("Error sending message", "error");
  //   } finally {
  //     useNotificationStore.getState().stopLoading();
  //   }
  // },

  getFiftyMessages: async (messageId: number, index: number) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await messageApi.getFiftyMessages(messageId, index);
      const sorted = [...data].reverse();
      set((state: MessageState) => ({
        messages: index === 0 ? sorted : [...sorted, ...state.messages],
        hasMore: data.length === 50,
      }));
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading messages", "error");
      return [];
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  setMessages: (message: MessageInput) => {
    set((state: MessageState) => {
      const existingIndex = state.messages.findIndex(
        (oldMessage) => oldMessage.messageId === message.messageId,
      );

      if (existingIndex === -1) {
        return {
          messages: [...state.messages, message],
        };
      }

      return {
        messages: state.messages.map((oldMessage) =>
          oldMessage.messageId === message.messageId
            ? { ...oldMessage, ...message }
            : oldMessage,
        ),
      };
    });
  },

  markMessageDeleted: (messageId: number) => {
    set((state: MessageState) => ({
      messages: state.messages.map((message) =>
        message.messageId === messageId
          ? { ...message, content: null }
          : message,
      ),
    }));
  },

  // getAllMessages: async () => {
  //   useNotificationStore.getState().startLoading();
  //   try {
  //     const data = await messageApi.getAll();
  //     set({ messages: data });
  //   } catch (e) {
  //     set({ error: "Error" + e });
  //     useNotificationStore
  //       .getState()
  //       .addNotification("Error loading messages", "error");
  //   } finally {
  //     useNotificationStore.getState().stopLoading();
  //   }
  // },

  // deleteMessage: async (messageId: number) => {
  //   useNotificationStore.getState().startLoading();
  //   try {
  //     await messageApi.delete(messageId);
  //     useNotificationStore
  //       .getState()
  //       .addNotification("Message successfully deleted", "success");
  //   } catch (e) {
  //     set({ error: "Fehler" + e });
  //     useNotificationStore
  //       .getState()
  //       .addNotification("Error deleting message", "error");
  //   } finally {
  //     useNotificationStore.getState().stopLoading();
  //   }
  // },
}));
