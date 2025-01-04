import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

import createDatabaseConnection from 'database/createConnection';
import { addRespondToResponse } from 'middleware/response';
// import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};

const initializeExpress = (): void => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(addRespondToResponse);
  attachPublicRoutes(app);
  // app.use('/', authenticateUser);
  attachPrivateRoutes(app);

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new RouteNotFoundError('Not found'));
  });

  app.use(handleError);

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
