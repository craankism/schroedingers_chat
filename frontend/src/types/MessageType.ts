export type MessageType = {
    messageId: number,
    content: string,
    roomId: number,
    createdBy: number
}

export type MessageInput = {
    content: string,
    roomId: number,
    createdBy: number
}