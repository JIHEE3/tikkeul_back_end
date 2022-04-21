import * as admin from '../database/admin';
import * as adminFileStorage from '../database/adminFileStorage';
import { IAdmin, IUpdateAdminAvatar } from '../models/Admin';
import { ICreateAdminFileStorage } from '../models/AdminFileStorage';
import { USER_STATUS } from '../models/UserStatus';
import db from '../loaders/connectDB';
import crypto from "crypto";

async function createAdmin(adminUser: IAdmin): Promise<number> {

  const saltBuf = crypto.randomBytes(64);
  const salt = saltBuf.toString("base64");

  const hashPasswordBuf = crypto.pbkdf2Sync(
    adminUser.password,
    salt,
    100000,
    64,
    "sha512"
  );
  const hashPassword = hashPasswordBuf.toString("base64");
  adminUser.password = hashPassword;
  adminUser.salt = salt;
  adminUser.status = USER_STATUS.member;

  const adminId = await admin.createAdmin(adminUser);

  return adminId;
}


async function editAdminAvatar(adminUser: IUpdateAdminAvatar): Promise<boolean> {
  const isOk = await admin.editAdminAvatar(adminUser);

  return isOk;
}


async function uploadAdminFile(adminFIle: ICreateAdminFileStorage, adminId: number): Promise<boolean> {
  await db.query('BEGIN');
  const adminFileStorageId = await adminFileStorage.createAdminFIle(adminFIle);
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
  createAdmin,
  editAdminAvatar,
  uploadAdminFile
}