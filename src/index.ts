import express from 'express';
import cors from 'cors';
import config from './config';
import users from './routes/users.routs';
import admin from './routes/admin.routs';

const app = express();

app
  .use(cors())
  .use(express.json())
  .use('/users', users)
  .use('/admin', admin);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})