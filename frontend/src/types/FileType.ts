export type FileType = {
    fileId: number,
    filename: string,
    size: number,
    mimeType: string,
    uploadedAt: string,
    uploadedBy: number
}

export type FileInput = {
   file: File
}