import 'dotenv/config';
import 'express-async-errors';
import logger from 'jet-logger';
import env from '@src/services/env';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import BaseRouter from '@src/routes/api';

// **** SERVER **** //

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') app.use(morgan('dev'));

if (env.NODE_ENV !== 'development') app.use(helmet());

app.use('/api', BaseRouter);

app.use((
	err: Error,
	_: Request,
	res: Response,
	next: NextFunction,
) => {
	if (env.NODE_ENV === 'development') logger.err(err, true);
	return res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.json({ error: err.message });
});

// **** Run **** //

const SERVER_START_MSG = (`Server started on port: ${env.PORT}`);
app.listen(env.PORT, () => logger.info(SERVER_START_MSG));
