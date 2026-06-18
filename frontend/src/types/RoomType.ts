export type RoomType = {
    roomId: number,
    name: string,
    createdBy: number,
    members: number[] // Is this the best way?
}

export type RoomInput ={
    name: string,
    createdBy: number
}