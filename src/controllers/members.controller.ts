import { Request, Response } from "express";
import { getMemberById, createMember, signAndGetToken, } from 'src/services/member';
import { ICreateMemberFileStorage } from 'src/models/MemberFileStorage';
import { uploadMemberFile } from 'src/services/member';
import { deleteFile } from 'src/utils/fileUtils';

export async function existId(req: Request, res: Response) {
  const id: string = req.params.id;
  const member = await getMemberById(id);

  res.send({
    isExist: member === null ? false : true
  })
}

export async function signUp(req: Request, res: Response) {
  let message = '';
  let resultCode = 1;

  const userId = await createMember(req.body);
  const { file } = req;

  if (userId === 0) {
    message = '회원가입 실패';
    resultCode = 0;
  } else {
    if (!!file) {
      const userFile: ICreateMemberFileStorage = {
        originalName: file.originalname,
        name: file.filename,
        path: file.path,
        creator: userId,
        modifier: userId
      }

      const isOk = await uploadMemberFile(userFile, userId);

      if (!isOk) {
        message = 'Avatar upload 실패';
        deleteFile(req.file.path);
      }
    }
  }


  res.send({
    resultCode,
    message
  })
}

export async function signIn(req: Request, res: Response) {
  let member = null;
  const { id, password } = req.body;

  const result = await signAndGetToken(id, password);

  if (result.resultCode === 1) {
    member = result.member;
  }

  res.send({
    resultCode: result.resultCode,
    message: result.message,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    profile: member !== null ? {
      firstName: member.firstName,
      lastName: member.lastName,
      avatar: member.avatar
    } : null
  })
}