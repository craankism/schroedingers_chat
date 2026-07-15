export type AiMode =
    | "MATRIX"
    | "DARK"
    | "LIGHT"
    | "UNICORN";

export type MessageType = {
    content: string,
    aiMode: AiMode;
}

export type MessageInput = {
    messageId: number,
    userId: number,
    content: string | null,
    sender: string,
    creationDate: string
    promptMessageId?: number | null
}