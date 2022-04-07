import express from 'express';
import config from './config';
import users from './routes/users';

const app = express();

app.use('/users', users);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})