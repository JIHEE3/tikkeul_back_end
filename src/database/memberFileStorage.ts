import db from 'src/loaders/connectDB';
import { ICreateMemberFileStorage } from 'src/models/MemberFileStorage';

async function createMemberFIle(memberFIle: ICreateMemberFileStorage): Promise<number> {
  let memberFileStorageId = 0;

  const {
    originalName,
    name,
    path,
    creator,
    modifier,
  } = memberFIle;

  try {
    const sql = `
      INSERT INTO member_file_storage (
          original_name
        , name
        , path
        , creator
        , modifier
        , created_date
        , modified_date

      )
      VALUES (
          $1
        , $2
        , $3
        , $4
        , $5
        , NOW()
        , NOW()
      )
      RETURNING *
  `;

    const values = [
      originalName,
      name,
      path,
      creator,
      modifier,
    ];

    const dbRes = await db.query(sql, values);
    const { rowCount, rows } = dbRes;

    if (rowCount > 0) {
      memberFileStorageId = rows[0].member_file_storage_id;
    }
  } catch (error) {
    console.log(error);
    throw (error);
  }

  return memberFileStorageId;
}

export {
  createMemberFIle
}