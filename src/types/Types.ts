import { IMember } from "../models/Member";

export type Data = {
  [key: string]: any;
};

export type EncryptPassword = {
  salt: string
  password: string
}

export type SignInResult = {
  resultCode: number
  message: string
  accessToken: string
  refreshToken: string
  member: IMember
}