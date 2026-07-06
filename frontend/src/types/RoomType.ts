export type RoomType = {
    roomId: number,
    name: string,
    createdBy: number,
    userList: number[],
}

export type RoomInput ={
    name: string,
    userIdSet: number[],
}