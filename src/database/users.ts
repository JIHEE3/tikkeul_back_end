import db from '../loaders/connectDB';
import { IUser } from '../models/User';
import { snakeObjToCamelObj } from '../utils/utils';

async function getUserById(id: string): Promise<IUser> {
  let user: IUser = null;

  try {
    const sql = `
      SELECT 
        *
      FROM member
      WHERE user_id = $1
    `;

    const dbRes = await db.query(sql, [id]);
    const { rowCount, rows } = dbRes;

    if (rowCount > 0) {

      user = snakeObjToCamelObj(rows[0]) as IUser;
    }
  } catch (error) {
    console.log(error);
    throw (error);
  }

  return user;
}

export {
  getUserById
}