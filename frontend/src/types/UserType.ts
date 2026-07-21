export type UserType = {
  userId: number;
  email: string;
  displayName: string;
  isAdmin: boolean;
  isTrainer: boolean;
  jwt: string;
  isActive?: boolean;
};

export type UserInput = {
  email: string;
  password: string;
  displayName: string;
};

export type UserChange = {
  displayName: string;
  oldPassword: string;
  newPassword: string;
};
