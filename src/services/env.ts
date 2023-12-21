import { cleanEnv, str, port } from 'envalid';

export default cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: str(),
  NODE_ENV: str({ choices: ['development', 'production'] }),
  TOKEN_SECRET: str(),
});
