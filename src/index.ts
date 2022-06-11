import express from 'express';
import cors from 'cors';
import config from 'src/config';
import users from 'src/routes/users.routs';
import admin from 'src/routes/admin.routs';

const app = express();

app
  .use(cors())
  .use(express.json())
  .use('/users', users)
  .use('/admin', admin);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})