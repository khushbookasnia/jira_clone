import { User } from 'entities';
import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      respond: (data: any) => void;
    }
    interface Request {
      currentUser?: User;
      originalUrl: string;
      get(header: string): string | undefined;
      headers: Record<string, string | string[] | undefined>;
    }
  }
}
