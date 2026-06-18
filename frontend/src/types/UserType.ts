export type UserType = {
    userId: number,
    email: string,
    pwdHash: string, // Do we need this for something?
    displayName: string,
    isAdmin: boolean,
    isTrainer: boolean
}

// Need to check Input: isAdmin and isTrainer should be set by admin, pwd gets transmitted/ also use for login?
export type UserInput = {
    email: string,
    pwd: string,
    displayName: string
}