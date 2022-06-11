import * as adminDB from 'src/database/admin';
import * as adminFileStorageDB from 'src/database/adminFileStorage';
import { IAdmin, IUpdateAdminAvatar } from 'src/models/Admin';
import { ICreateAdminFileStorage } from 'src/models/AdminFileStorage';
import { USER_STATUS } from 'src/models/UserStatus';
import db from 'src/loaders/connectDB';
import {
  idPatternIsOk,
  pwPatternIsOk,
  userNamePatternIsOk,
  birthDatePatternIsOk,
  emailIsOk
} from 'src/utils/validate';
import { SignInResult } from 'src/types/Types';
import { encryptPassword, encryptPasswordBySalt } from 'src/utils/utils';
import { makeAdminAccessToken, makeRefreshToken } from 'src/utils/jwtUtils';
import { addAdminRefreshToken } from 'src/redis/jwtRedis';


export async function getAdminById(id: string): Promise<IAdmin> {
  const user = await adminDB.getAdminById(id);

  return user;
}

export async function createAdmin(adminUser: IAdmin): Promise<number> {
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


export async function editAdminAvatar(adminUser: IUpdateAdminAvatar): Promise<boolean> {
  const isOk = await adminDB.editAdminAvatar(adminUser);

  return isOk;
}


export async function uploadAdminFile(adminFIle: ICreateAdminFileStorage, adminId: number): Promise<boolean> {
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

export async function checkIdPassword(adminUser: IAdmin, password: string)
  : Promise<boolean> {
  let isOk = false;

  if (adminUser !== null) {
    const hashPassword = encryptPasswordBySalt(password, adminUser.salt);

    if (adminUser.password === hashPassword) {
      isOk = true;
    }
  }

  return isOk;
}

export async function signAndGetToken(id: string, password: string): Promise<SignInResult> {
  let result: SignInResult = {
    resultCode: 0,
    message: '',
    accessToken: '',
    refreshToken: '',
    member: null,
  };

  const member = await getAdminById(id);
  if (await checkIdPassword(member, password)) {
    try {
      const accessToken = makeAdminAccessToken(member);
      const refreshToken = makeRefreshToken();
      await addAdminRefreshToken(member.id, refreshToken);
      result.resultCode = 1;
      result.accessToken = accessToken;
      result.refreshToken = refreshToken;
      result.member = member;
    } catch (error) {
      result.message = error.message;
    }
  } else {
    result.message = '아이디와 비밀번호를 다시 확인해 주세요.';
  }

  return result;

}
