import { createConnection } from 'typeorm';

import * as entities from 'entities';

const checkConnection = async () => {
  try {
    console.log('Attempting to connect to the database...');
    const connection = await createConnection({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'dnschool',
      database: 'jira_development',
      entities: Object.values(entities),
      synchronize: true,
    });

    console.log('Connection established successfully!');

    const result = await connection.query('SELECT NOW()');
    console.log('Database Time:', result);

    await connection.close();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export default checkConnection;
