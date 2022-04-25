import multer from 'multer';
import path from 'path';

import config from '../config';

export const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    /* 사용자 프로필 사진 업로드 위치 */
    const avatarPath = path.join(config.fileStorageRoot, '/avatar')
    cb(null, avatarPath);
  },
  filename: (req, file, cb) => {
    /* 사용자 프로필 사진 파일명 unique 한 값 생성 */
    cb(
      null,
      new Date().valueOf() + '_' + req.body.id + '_' + file.originalname
    );
  },
});
