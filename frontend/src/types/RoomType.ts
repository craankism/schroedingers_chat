export type RoomType = {
    roomId: number,
    name: string,
    createdBy: string,
    userList: number[],
}

export type RoomInput ={
    name: string,
    userIdSet: number[],
}