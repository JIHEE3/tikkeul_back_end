import express from 'express';
import { existId, signUp, signIn } from '../controllers/members.controller';
import multer from 'multer';

import { avatarStorage } from '../middlewares/file.middlewares';

const router = express.Router();
const upload = multer({ storage: avatarStorage });

router.get('/exist/:id', existId);

router.post('/signup', upload.single('avatar'), signUp);
router.post('/signin', signIn);

export default router;