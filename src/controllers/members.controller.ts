import { Request, Response } from "express";
import { getMemberById, createMember, } from '../services/member';
import { ICreateMemberFileStorage } from '../models/MemberFileStorage';
import { uploadMemberFile } from '../services/member';
import { deleteFile } from '../utils/fileUtils';

async function existId(req: Request, res: Response) {
  const id: string = req.params.id;
  const member = await getMemberById(id);

  res.send({
    isExist: member === null ? false : true
  })
}

async function signUp(req: Request, res: Response) {
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

export {
  existId,
  signUp
}