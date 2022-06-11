import * as memberDB from '../database/member';
import * as memberFileStorageDB from '../database/memberFileStorage';
import { IMember, IUpdateMemberAvatar } from '../models/Member';
import { ICreateMemberFileStorage } from '../models/MemberFileStorage';
import { USER_STATUS } from '../models/UserStatus';
import db from '../loaders/connectDB';
import {
  idPatternIsOk,
  pwPatternIsOk,
  userNamePatternIsOk,
  birthDatePatternIsOk,
  emailIsOk
} from '../utils/validate';
import { encryptPassword, encryptPasswordBySalt } from '../utils/utils';
import { makeMemberAccessToken, makeRefreshToken } from '../utils/jwtUtils';
import { SignInResult } from '../types/Types';
import { addMemberRefreshToken } from '../redis/jwtRedis';

export async function getMemberById(id: string): Promise<IMember> {
  const member = await memberDB.getMemberById(id);

  return member;
}

export async function createMember(member: IMember): Promise<number> {
  let memberId = 0;

  if (idPatternIsOk(member.id)
    && getMemberById(member.id) === null
    && pwPatternIsOk(member.password)
    && userNamePatternIsOk(member.firstName)
    && userNamePatternIsOk(member.lastName)
    && birthDatePatternIsOk(member.birthDate)
    && emailIsOk(member.email)
  ) {

    const encryptedPassword = encryptPassword(member.password);


    member.password = encryptedPassword.password;
    member.salt = encryptedPassword.salt;
    member.status = USER_STATUS.member;

    memberId = await memberDB.createMember(member);
  }


  return memberId;
}

export async function editMemberAvatar(user: IUpdateMemberAvatar): Promise<boolean> {
  const isOk = await memberDB.editMemberAvatar(user);

  return isOk;
}

export async function uploadMemberFile(memberFIle: ICreateMemberFileStorage, memberId: number)
  : Promise<boolean> {
  await db.query('BEGIN');
  const memberFileStorageId = await memberFileStorageDB.createMemberFIle(memberFIle);
  let isOk = false;

  if (memberFileStorageId !== 0) {
    const user: IUpdateMemberAvatar = {
      memberId,
      avatar: memberFileStorageId,
      modifier: memberId
    }

    isOk = await editMemberAvatar(user);
  }

  if (isOk) {
    await db.query('COMMIT');
  } else {
    await db.query('ROLLBACK');
  }

  return isOk;
}

export async function checkIdPassword(member: IMember, password: string)
  : Promise<boolean> {
  let isOk = false;

  if (member !== null) {
    const hashPassword = encryptPasswordBySalt(password, member.salt);

    if (member.password === hashPassword) {
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

  const member = await getMemberById(id);
  if (await checkIdPassword(member, password)) {
    try {
      const accessToken = makeMemberAccessToken(member);
      const refreshToken = makeRefreshToken();
      await addMemberRefreshToken(member.id, refreshToken);
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