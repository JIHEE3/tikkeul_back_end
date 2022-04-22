import { Request, Response } from "express";
import { createAdmin, uploadAdminFile } from '../services/admin';
import { ICreateAdminFileStorage } from '../models/AdminFileStorage';

async function signUp(req: Request, res: Response) {
  let message = '';
  let result = 1;

  const adminId = await createAdmin(req.body);
  const { file } = req;

  if (adminId === 0) {
    message = '회원가입 실패';
    result = 0;
  } else {
    if (!!file) {
      const adminFile: ICreateAdminFileStorage = {
        originalName: file.originalname,
        name: file.filename,
        path: file.path,
        creator: adminId,
        modifier: adminId
      }

      const isOk = await uploadAdminFile(adminFile, adminId);

      if (!isOk) {
        message = 'Avatar upload 실패';
        // 파일 삭제해주기~~~~~*********
      }
    }
  }

  res.send({
    result,
    message
  })
}

export {
  signUp
}