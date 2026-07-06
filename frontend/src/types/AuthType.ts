export type AuthLoginType = {
  email: string;
  password: string;
};

export type AuthResponseType = {
  userId: number,
  email: string,
  displayName: string,
  isAdmin: boolean,
  isTrainer: boolean,
  isActive: boolean,
  jwt: string,
  refreshToken: string,
}

export type registrationReturn = {
  registrationCode: string;
};

export type CodeValidationType = {
  valid: boolean;
};
