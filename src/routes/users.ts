import express from 'express';

import db from '../loaders/connectDB';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!')
})

export default router;