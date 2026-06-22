export type AuthLoginType = {
    email: string,
    password: string,
}

export type registrationInput = {
    isTrainer: boolean,
    createdBy: number,
}

export type registrationReturn = {
    registrationCode: string
}