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
import { encryptPassword } from '../utils/utils';

async function getMemberById(id: string): Promise<IMember> {
  const member = await memberDB.getMemberById(id);

  return member;
}


async function createMember(member: IMember): Promise<number> {
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


async function editMemberAvatar(user: IUpdateMemberAvatar): Promise<boolean> {
  const isOk = await memberDB.editMemberAvatar(user);

  return isOk;
}


async function uploadMemberFile(memberFIle: ICreateMemberFileStorage, memberId: number): Promise<boolean> {
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


export {
  getMemberById,
  createMember,
  editMemberAvatar,
  uploadMemberFile
}