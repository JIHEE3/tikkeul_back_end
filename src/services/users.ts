import * as users from '../database/users';
import { IUser } from '../models/user';

async function getUserById(id: string): Promise<IUser> {
  const user = await users.getUserById(id);

  return user;
}

export {
  getUserById
}