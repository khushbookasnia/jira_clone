import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL!);

export const getProjectWithUsersAndIssues = async (req: any, res: any, _next: any) => {
  try {
    // Ensure project_id is provided
    const { id: project_id } = req.currentUser ?? {};
    console.log('project_id:', project_id, req.currentUser);
    if (!project_id) {
      return res.status(400).send({ message: 'Project ID is required.' });
    }

    const projectResult = await sql`SELECT * FROM projects WHERE id = ${project_id}`;

    const issuesResult = await sql`
      SELECT * 
      FROM issues 
      WHERE project_id = ${project_id}
    `;

    const usersResult = await sql`
      SELECT u.* 
      FROM users u
      INNER JOIN users_projects pu ON u.id = pu.user_id
      WHERE pu.project_id = ${project_id}
    `;

    // Check if the project exists
    if (projectResult.length === 0) {
      return res.status(404).send({ message: 'Project not found' });
    }

    // Respond with the combined data
    res.respond({
      project: {
        ...projectResult[0], // First row contains the project data
        issues: issuesResult, // Array of issues
        users: usersResult, // Array of users
      },
    });
  } catch (error) {
    console.error('Error fetching project data:', error);
    return res.status(500).send({ message: 'An error occurred while fetching the project data.' });
  }
};

export const update = async (req: any, res: any, _next: any) => {
  const { projectId } = req.currentUser ?? {};
  const updateData = req.body; // You can sanitize this or validate it if needed

  const updateQuery = `
    UPDATE projects
    SET name = $1, url = $2, description = $3
    WHERE id = $4
    RETURNING *;
  `;

  // Use parameterized queries
  const updateResult = await sql`${updateQuery} ${updateData.name} ${updateData.url} ${updateData.description} ${projectId}`;

  if (!updateResult[0]) {
    return res.status(404).send({ message: 'Project not found or not updated' });
  }

  res.respond({ project: updateResult[0] });
  return; // Ensure no return value that conflicts with Express
};
