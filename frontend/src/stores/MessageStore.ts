import type { MessageInput, MessageType } from "../types/MessageType.ts";
import { create } from "zustand/react";
import { messageApi } from "../services/apiCalls.ts";

type MessageState = {
    messages: MessageType[];
    error: string | null;
    postMessage: (messageData: MessageInput) => void;
    getMessage: (messageId: number) => void;
    getAllMessages: () => void;
    deleteMessage: (messageId: number) => void;
}

export const useMessageStore = create<MessageState>(
    (set) => ({
        messages: [],
        error: null,

        postMessage: async (messageData: MessageInput) => {
            try {
                const data = await messageApi.post(messageData);
                set((state: MessageState) => ({
                    messages: [...state.messages, data]
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getMessage: async (messageId: number) => {
            try {
                const data = await messageApi.getById(messageId);
                set((state: MessageState) => ({
                    messages: state.messages.map(msg => msg.messageId === messageId ? {...msg, ...data} : msg)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getAllMessages: async () => {
            try {
                const data = await messageApi.getAll();
                set({messages: data})
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        deleteMessage: async (messageId: number) => {
            try {
                await messageApi.delete(messageId);
                set((state: MessageState) => ({
                    messages: state.messages.filter(msg => msg.messageId !== messageId)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        }
    })
)