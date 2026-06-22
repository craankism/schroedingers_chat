export type UserType = {
    userId: number,
    email: string,
    displayName: string,
    isAdmin: boolean,
    isTrainer: boolean,
    inviteKey: string,
}

export type UserInput = {
    email: string,
    pwd: string,
    displayName: string
}