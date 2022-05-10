import * as adminDB from '../database/admin';
import * as adminFileStorageDB from '../database/adminFileStorage';
import { IAdmin, IUpdateAdminAvatar } from '../models/Admin';
import { ICreateAdminFileStorage } from '../models/AdminFileStorage';
import { USER_STATUS } from '../models/UserStatus';
import db from '../loaders/connectDB';
import {
  idPatternIsOk,
  pwPatternIsOk,
  userNamePatternIsOk,
  birthDatePatternIsOk,
  emailIsOk
} from '../utils/validate';
import { encryptPassword } from '../utils/utils';


async function getAdminById(id: string): Promise<IAdmin> {
  const user = await adminDB.getAdminById(id);

  return user;
}

async function createAdmin(adminUser: IAdmin): Promise<number> {
  let adminId = 0;

  if (idPatternIsOk(adminUser.id)
    && getAdminById(adminUser.id) === null
    && pwPatternIsOk(adminUser.password)
    && userNamePatternIsOk(adminUser.firstName)
    && userNamePatternIsOk(adminUser.lastName)
    && birthDatePatternIsOk(adminUser.birthDate)
    && emailIsOk(adminUser.email)
  ) {

    const encryptedPassword = encryptPassword(adminUser.password);

    adminUser.password = encryptedPassword.password;
    adminUser.salt = encryptedPassword.salt;
    adminUser.status = USER_STATUS.member;

    adminId = await adminDB.createAdmin(adminUser);
  }


  return adminId;
}


async function editAdminAvatar(adminUser: IUpdateAdminAvatar): Promise<boolean> {
  const isOk = await adminDB.editAdminAvatar(adminUser);

  return isOk;
}


async function uploadAdminFile(adminFIle: ICreateAdminFileStorage, adminId: number): Promise<boolean> {
  await db.query('BEGIN');
  const adminFileStorageId = await adminFileStorageDB.createAdminFIle(adminFIle);
  let isOk = false;

  if (adminFileStorageId !== 0) {
    const adminUser: IUpdateAdminAvatar = {
      adminId,
      avatar: adminFileStorageId,
      modifier: adminId
    }

    isOk = await editAdminAvatar(adminUser);
  }

  if (isOk) {
    await db.query('COMMIT');
  } else {
    await db.query('ROLLBACK');
  }

  return isOk;
}


export {
  getAdminById,
  createAdmin,
  editAdminAvatar,
  uploadAdminFile
}