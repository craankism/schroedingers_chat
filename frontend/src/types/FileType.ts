export type FileType = {
    fileId: number,
    filename: string,
    path: string,
    size: number,
    uploadedBy: number
}

export type FileInput = {
    filename: string,
    path: string,
    size: number,
    uploadedBy: number
}