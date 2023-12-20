import { cleanEnv, str, port } from 'envalid';

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: str(),
  NODE_ENV: str({ choices: ['development', 'production'] }),
});
