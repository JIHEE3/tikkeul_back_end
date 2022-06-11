import { Client } from 'pg';
import config from 'src/config';

const client = new Client({
  user: config.db.user,
  password: config.db.pass,
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
});

client.connect();
export default client;