import db from '../loaders/connectDB';
import { IAdmin, IUpdateAdminAvatar } from '../models/Admin';
import { snakeObjToCamelObj } from '../utils/utils';

async function getAdminById(id: string): Promise<IAdmin> {
  let admin: IAdmin = null;

  try {
    const sql = `
      SELECT 
        *
      FROM admin
      WHERE admin_id = $1
    `;

    const dbRes = await db.query(sql, [id]);
    const { rowCount, rows } = dbRes;

    if (rowCount > 0) {

      admin = snakeObjToCamelObj(rows[0]) as IAdmin;
    }
  } catch (error) {
    console.log(error);
  }

  return admin;
}

async function createAdmin(adminUser: IAdmin): Promise<number> {
  let adminId = 0;

  const {
    id,
    password,
    salt,
    firstName,
    lastName,
    email,
    birthDate,
    gender,
    phoneNumber,
    status,
  } = adminUser;

  try {
    await db.query('BEGIN');

    const sql = `
      INSERT INTO admin (
          id
        , password
        , salt
        , first_name
        , last_name
        , email
        , birth_date
        , gender
        , phone_number
        , status
        , created_date
        , modified_date

      )
      VALUES (
          $1
        , $2
        , $3
        , $4
        , $5
        , $6
        , $7
        , $8
        , $9
        , $10
        , NOW()
        , NOW()
      )
      RETURNING *
  `;

    const values = [
      id,
      password,
      salt,
      firstName,
      lastName,
      email,
      birthDate,
      gender,
      phoneNumber,
      status,];

    const dbRes = await db.query(sql, values);
    const { rowCount, rows } = dbRes;

    if (rowCount > 0) {
      adminId = rows[0].admin_id;
    }

    await db.query('COMMIT');


  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
  }


  return adminId;
}


async function editAdminAvatar(adminUser: IUpdateAdminAvatar): Promise<boolean> {
  let isOk = false;

  const {
    adminId,
    avatar,
    modifier,
  } = adminUser;

  try {
    const sql = `
      UPDATE admin SET (
          avatar
        , modifier
        , modified_date

      )
      = (
          $1
        , $2
        , NOW()
      )
      WHERE admin_id = $3
      RETURNING *
  `;

    const values = [
      avatar,
      modifier,
      adminId,
    ];

    const dbRes = await db.query(sql, values);
    const { rowCount } = dbRes;

    if (rowCount > 0) {
      isOk = true;

    }

  } catch (error) {
    console.log(error);
  }

  return isOk;
}





export {
  getAdminById,
  createAdmin,
  editAdminAvatar
}