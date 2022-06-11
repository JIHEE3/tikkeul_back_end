import db from 'src/loaders/connectDB';
import { IMember, IUpdateMemberAvatar } from 'src/models/Member';
import { snakeObjToCamelObj } from 'src/utils/utils';

async function getMemberById(id: string): Promise<IMember> {
  let memger: IMember = null;

  try {
    const sql = `
      SELECT 
        *
      FROM member
      WHERE id = $1
    `;

    const dbRes = await db.query(sql, [id]);
    const { rowCount, rows } = dbRes;

    if (rowCount > 0) {

      memger = snakeObjToCamelObj(rows[0]) as IMember;
    }
  } catch (error) {
    console.log(error);
    throw (error);
  }

  return memger;
}


async function createMember(member: IMember): Promise<number> {
  let memberId = 0;

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
  } = member;

  try {
    await db.query('BEGIN');

    const sql = `
      INSERT INTO member (
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
      memberId = rows[0].member_id;
    }

    await db.query('COMMIT');

  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    throw (error);
  }


  return memberId;
}


async function editMemberAvatar(member: IUpdateMemberAvatar): Promise<boolean> {
  let isOk = false;

  const {
    memberId,
    avatar,
    modifier,
  } = member;

  try {
    const sql = `
      UPDATE member SET (
          avatar
        , modifier
        , modified_date

      )
      = (
          $1
        , $2
        , NOW()
      )
      WHERE member_id = $3
      RETURNING *
  `;

    const values = [
      avatar,
      modifier,
      memberId,
    ];

    const dbRes = await db.query(sql, values);
    const { rowCount } = dbRes;

    if (rowCount > 0) {
      isOk = true;

    }

  } catch (error) {
    console.log(error);
    throw (error);
  }

  return isOk;
}



export {
  getMemberById,
  createMember,
  editMemberAvatar
}