import {endpointUrl} from "../types/constants/constants.ts";
import axios from "axios";
import type {FileInput, FileType} from "../types/FileType.ts";
import type {UserInput, UserType} from "../types/UserType.ts";
import type {RoomInput, RoomType} from "../types/RoomType.ts";
import type {MessageInput, MessageType} from "../types/MessageType.ts";
import type {AuthLoginType, registrationInput, registrationReturn} from "../types/AuthType.ts";

const fileUrl = endpointUrl + "/file";
const userUrl = endpointUrl + "/user";
const roomUrl = endpointUrl + "/room";
const messageUrl = endpointUrl + "/message";
const registrationUrl = endpointUrl + "/auth/register";
const loginUrl = endpointUrl + "/login";
const validationUrl = endpointUrl + "/";


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
    createUser: async (registrationCode: string, user: UserInput): Promise<UserType> => {
        const response = await axios.put<UserType>(`${registrationUrl}/${registrationCode}`, user);
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

export const authApi = {
    createRegistrationCode: async (registration: registrationInput): Promise<registrationReturn> => {
        const response = await axios.post<registrationReturn>(registrationUrl, registration);
        return response.data;
    },

    login: async (credentials: AuthLoginType): Promise<UserType> => {
        const response = await axios.post<UserType>(loginUrl, credentials);
        return response.data;
    },

    validateCode: async (registrationCode: string)=> {
        const response = await axios.post<boolean>(validationUrl + registrationCode)
        return response.data;
    }
}