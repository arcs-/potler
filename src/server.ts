import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import env from '@src/env';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';

// **** Variables **** //

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (env.NODE_ENV !== 'development') {
  app.use(helmet());
}

app.use('/api', BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (env.NODE_ENV === 'development') {
    logger.err(err, true);
  }
  return res.status(500).json({ error: err.message });
});

export default app;
