/**
 * Setup express server.
 */

import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import env from '@src/env';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (env.NODE_ENV !== 'development') {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use('/api', BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (env.NODE_ENV === 'development') {
    logger.err(err, true);
  }


  return res.status(500).json({ error: err.message });
});

export default app;
