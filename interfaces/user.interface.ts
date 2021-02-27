export interface IUser {
  name?: string;
  email?: string;
  password?: string;
}

export interface IUserToken {
  name: string;
  email: string;
}

export interface UserSchema {
  _id: { $oid: string };
  name: string;
  email: string;
  password: string;
}
