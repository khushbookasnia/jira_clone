import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'utils/authToken';
import { catchErrors, InvalidTokenError } from 'errors';
import { neon } from '@neondatabase/serverless';
import { User } from 'entities';

const sql = neon(process.env.NEON_DATABASE_URL!);

export const authenticateUser = catchErrors(
  async (req: Request, _res: Response, next: NextFunction) => {
    console.log('authenticateUser now');
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('token', token);

    if (!token) {
      throw new InvalidTokenError('Authentication token not found.');
    }

    const userId = verifyToken(token).sub;

    if (!userId) {
      throw new InvalidTokenError('Authentication token is invalid.');
    }

    const user = await sql`
      SELECT * FROM users WHERE id = ${userId.id} LIMIT 1
    `;

    console.log('userId ----------------', user[0]);

    req.currentUser = user[0] as User;

    next();
  },
);
