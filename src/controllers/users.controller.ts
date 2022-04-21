import { Request, Response } from "express";
import { getUserById } from '../services/users';

async function existId(req: Request, res: Response) {
  const id: string = req.params.id;
  const user = await getUserById(id);

  res.send({
    isExist: user === null ? false : true
  })
}

export {
  existId
}