// import { createConnection } from 'typeorm';
// import * as entities from 'entities'; // Ensure entities are imported correctly
import { neon } from '@neondatabase/serverless';

const createDatabaseConnection = async (): Promise<void> => {
  try {
    const sql = neon(
      'postgresql://jira_development_owner:g6mhyN9TOjQn@ep-fragrant-art-a19fjmxa.ap-southeast-1.aws.neon.tech/jira_development?sslmode=require',
    );
    const result = await sql`SELECT version()`;
    console.log('Connected to Neon Database:', result[0].version);

    // Create the database connection using TypeORM and synchronize the schema
    // await createConnection({
    //   type: 'postgres',
    //   url:
    //     'postgresql://jira_development_owner:g6mhyN9TOjQn@ep-fragrant-art-a19fjmxa.ap-southeast-1.aws.neon.tech/jira_development?sslmode=require',
    //   entities: Object.values(entities), // Import your entities
    //   synchronize: true, // This will automatically create the tables if they don't exist
    //   logging: true, // Enable logging for debugging
    // });
    console.log('Entities synchronized with Neon DB.');
  } catch (error) {
    console.error('Error establishing database connection:', error);
    process.exit(1); // Exit if connection fails
  }
};

export default createDatabaseConnection;
