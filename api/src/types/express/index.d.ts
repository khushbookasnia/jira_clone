import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      respond: (data: any) => void;
    }
    interface Request {
      currentUser: import('entities').User;
      originalUrl: string;
    }
  }
}
