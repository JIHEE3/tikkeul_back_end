import express from 'express';
import { signUp } from '../controllers/admin.controller';
import multer from 'multer';

import { avatarStorage } from '../middlewares/file.middlewares';

const router = express.Router();
const upload = multer({ storage: avatarStorage });

// router.get('/exist/:id', signUp)
router.post('/signup', upload.single('avatar'), signUp);

export default router;