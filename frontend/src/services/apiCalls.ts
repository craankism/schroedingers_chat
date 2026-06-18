import {endpointUrl} from "../types/constants/constants.ts";
import axios from "axios";
import type {FileInput, FileType} from "../types/FileType.ts";
import type {UserInput, UserType} from "../types/UserType.ts";
import type {RoomInput, RoomType} from "../types/RoomType.ts";
import type {MessageInput, MessageType} from "../types/MessageType.ts";

const fileUrl = endpointUrl + "/file";
const userUrl = endpointUrl + "/user";
const roomUrl = endpointUrl + "/room";
const messageUrl = endpointUrl + "/message";


export const fileApi = {
    getAll: async (): Promise<FileType[]> => {
        const response = await axios.get<FileType[]>(fileUrl);
        return response.data;
    },

    getById: async (fileId: number): Promise<FileType> => {
        const response = await axios.get<FileType>(`${fileUrl}/${fileId}`);
        return response.data;
    },

    upload: async (file: FileInput): Promise<FileType> => {
        const response = await axios.post<FileType>(fileUrl, file);
        return response.data;
    },

    delete: async (fileId: number): Promise<void> => {
        await axios.delete(`${fileUrl}/${fileId}`);
    }
};

export const userApi = {
    getAll: async (): Promise<UserType[]> => {
        const response = await axios.get<UserType[]>(userUrl);
        return response.data;
    },
    getById: async (userId: number): Promise<UserType> => {
        const response = await axios.get<UserType>(`${userUrl}/${userId}`);
        return response.data;
    },
    create: async (user: UserInput): Promise<UserType> => {
        const response = await axios.post<UserType>(userUrl, user);
        return response.data;
    },
    delete: async (userId: number): Promise<void> => {
        await axios.delete(`${userUrl}/${userId}`);
    }
};

export const roomApi = {
    getAll: async (): Promise<RoomType[]> => {
        const response = await axios.get<RoomType[]>(roomUrl);
        return response.data;
    },


    getById: async (roomId: number): Promise<RoomType> => {
        const response = await axios.get<RoomType>(`${roomUrl}/${roomId}`);
        return response.data;
    },

    create: async (room: RoomInput): Promise<RoomType> => {
        const response = await axios.post<RoomType>(roomUrl, room);
        return response.data;
    },

    delete: async (roomId: number): Promise<void> => {
        await axios.delete(`${roomUrl}/${roomId}`);
    }
};

export const messageApi = {
    getAll: async (): Promise<MessageType[]> => {
        const response = await axios.get<MessageType[]>(messageUrl);
        return response.data;
    },

    getById: async (messageId: number): Promise<MessageType> => {
        const response = await axios.get<MessageType>(`${messageUrl}/${messageId}`);
        return response.data;
    },

    post: async (message: MessageInput): Promise<MessageType> => {
        const response = await axios.post<MessageType>(messageUrl, message);
        return response.data;
    },

    delete: async (messageId: number): Promise<void> => {
        await axios.delete(`${messageUrl}/${messageId}`);
    }
};