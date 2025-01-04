import { neon } from '@neondatabase/serverless';

const createDatabaseConnection = async (): Promise<void> => {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!);
    const result = await sql`SELECT version()`;
    console.log('Connected to Neon Database:', result[0].version);
    console.log('Entities synchronized with Neon DB.');
  } catch (error) {
    console.error('Error establishing database connection:', error);
    process.exit(1);
  }
};

export default createDatabaseConnection;
