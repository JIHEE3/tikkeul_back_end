import db from 'src/loaders/connectDB';
import { ICreateAdminFileStorage } from 'src/models/AdminFileStorage';

async function createAdminFIle(adminFIle: ICreateAdminFileStorage): Promise<number> {
  let adminFileStorageId = 0;

  const {
    originalName,
    name,
    path,
    creator,
    modifier,
  } = adminFIle;

  try {
    const sql = `
      INSERT INTO admin_file_storage (
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
      adminFileStorageId = rows[0].admin_file_storage_id;
    }
  } catch (error) {
    console.log(error);
    throw (error);
  }

  return adminFileStorageId;
}

export {
  createAdminFIle
}