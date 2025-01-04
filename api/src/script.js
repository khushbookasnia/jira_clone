const { neon } = require('@neondatabase/serverless');

// Create a Neon client
const sql = neon(
  'postgresql://jira_development_owner:g6mhyN9TOjQn@ep-fragrant-art-a19fjmxa.ap-southeast-1.aws.neon.tech/jira_development?sslmode=require',
);

const seedUsers = async () => {
  try {
    const users = [
      {
        email: 'rick@jira.guest',
        name: 'Pickle Rick',
        avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
      },
      {
        email: 'yoda@jira.guest',
        name: 'Baby Yoda',
        avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
      },
      {
        email: 'gaben@jira.guest',
        name: 'Lord Gaben',
        avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
      },
    ];

    // Ensure the users table exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT
      );
    `;

    // Insert the user data
    for (const user of users) {
      await sql`
        INSERT INTO users (email, name, avatar_url)
        VALUES (${user.email}, ${user.name}, ${user.avatarUrl})
        ON CONFLICT (email) DO NOTHING;
      `;
    }

    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Run the seed function
seedUsers().catch(err => {
  console.error('Failed to seed users:', err);
});
