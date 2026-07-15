export type MessageType = {
    content: string,
}

export type MessageInput = {
    messageId: number,
    userId: number,
    content: string | null,
    sender: string,
    creationDate: string
    promptMessageId?: number | null
}