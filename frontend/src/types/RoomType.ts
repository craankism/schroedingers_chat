export type RoomType = {
    roomId: number,
    name: string,
    members: number[],
}

export type RoomInput ={
    name: string,
    userIdSet: number[],
}