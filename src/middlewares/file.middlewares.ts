import multer from 'multer';


export const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    /* 사용자 프로필 사진 업로드 위치 */
    cb(null, 'uploads/avatar');
  },
  filename: (req, file, cb) => {
    /* 사용자 프로필 사진 파일명 unique 한 값 생성 */
    cb(
      null,
      new Date().valueOf() + '_' + req.body.id + '_' + file.originalname
    );
  },
});
