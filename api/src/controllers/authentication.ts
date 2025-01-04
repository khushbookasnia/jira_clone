import { signToken } from 'utils/authToken'; // Utility to sign the token
import { neon } from '@neondatabase/serverless'; // Neon database serverless package

const sql = neon(process.env.NEON_DATABASE_URL!);

export const createGuestAccount = async (_req: any, res: any) => {
  const user = await sql`SELECT * FROM users LIMIT 1`;
  console.log('Guest account created:', user[0]);
  const authToken = signToken({ sub: user[0] });

  res.json({
    authToken,
  });
};
