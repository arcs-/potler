import 'dotenv/config';

import logger from 'jet-logger';
import server from './server';
import env from '@src/env';


// **** Run **** //

const SERVER_START_MSG = (`Server started on port: ${env.PORT}`);

server.listen(env.PORT, () => logger.info(SERVER_START_MSG));
