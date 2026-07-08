export type MessageType = {
    content: string,
}

export type MessageInput = {
    messageId: number,
    content: string | null,
    sender: string,
    creationDate: string
}