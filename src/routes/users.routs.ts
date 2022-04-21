import express from 'express';
import { existId } from '../controllers/users.controller';

const router = express.Router();

router.get('/exist/:id', existId)

export default router;