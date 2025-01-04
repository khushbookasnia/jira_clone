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
  console.log('1st----');
  const app = express();
  console.log('2nd----');
  // Allow all origins to access the API
  app.use(cors());
  console.log('3rd----');
  app.use(express.json());
  console.log('4th----');
  app.use(express.urlencoded());
  console.log('5th----');
  app.use(addRespondToResponse);
  console.log('6th----');

  attachPublicRoutes(app);
  console.log('7th----');

  // app.use('/', authenticateUser);

  attachPrivateRoutes(app);
  console.log('8th----');

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new RouteNotFoundError('Not found'));
  });
  console.log('9th----');
  app.use(handleError);
  console.log('10th----');

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
  console.log('11th----');
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
