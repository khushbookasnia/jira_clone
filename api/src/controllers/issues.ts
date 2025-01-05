import { neon, neonConfig } from '@neondatabase/serverless';
import { Issue } from 'entities';
import { catchErrors } from 'errors';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.NEON_DATABASE_URL!);

export const getProjectIssues = catchErrors(async (req, res) => {
  const { id: projectId } = req.currentUser ?? {};
  const { searchTerm } = req.query;

  let query = `SELECT * FROM issues WHERE project_id = ${projectId}`;
  let params: any[] = [projectId];

  if (searchTerm) {
    query += ' AND (title ILIKE $2 OR description_text ILIKE $2)';
    params.push(`%${searchTerm}%`);
  }

  const issues = await sql(query, ...params);
  res.respond({ issues });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const { issueId } = req.params;
  const issue = await sql`
    SELECT i.*, 
           json_agg(DISTINCT u.*) AS users,
           json_agg(DISTINCT c.*) AS comments
    FROM issues i
    LEFT JOIN issue_users iu ON i.id = iu.issue_id
    LEFT JOIN users u ON iu.user_id = u.id
    LEFT JOIN comments c ON i.id = c.issue_id
    WHERE i.id = ${issueId}
    GROUP BY i.id
  `;

  if (!issue[0]) {
    throw new Error('Issue not found');
  }

  res.respond({ issue: issue[0] });
});

export const create = catchErrors(async (req, res) => {
  const listPosition = await calculateListPosition(req.body);
  const { title, description, status, priority, type, reporterId, projectId } = req.body;

  const [issue] = await sql`
    INSERT INTO issues (title, description, status, priority, type, reporter_id, project_id, list_position)
    VALUES (${title}, ${description}, ${status}, ${priority}, ${type}, ${reporterId}, ${projectId}, ${listPosition})
    RETURNING *
  `;

  res.respond({ issue });
});

export const update = async (req: any, res: any) => {
  const { issueId } = req.params;
  const updateFields = req.body;

  // Construct the dynamic update query
  const updateColumns = Object.keys(updateFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  const updateValues = Object.values(updateFields);

  if (updateColumns.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const query = `
    UPDATE issues
    SET ${updateColumns}
    WHERE id = $1
    RETURNING *
  `;

  const [issue] = await sql(query, [issueId, ...updateValues]);

  if (!issue) {
    throw new Error('Issue not found');
  }

  res.respond({ issue });
};

export const remove = catchErrors(async (req, res) => {
  const { issueId } = req.params;

  const [issue] = await sql`
    DELETE FROM issues
    WHERE id = ${issueId}
    RETURNING *
  `;

  if (!issue) {
    throw new Error('Issue not found');
  }

  res.respond({ issue });
});

const calculateListPosition = async ({ projectId, status }: Partial<Issue>): Promise<number> => {
  const issues = await sql`
    SELECT list_position 
    FROM issues 
    WHERE project_id = ${projectId} AND status = ${status}
  `;

  const listPositions = issues.map(({ list_position }) => list_position);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) - 1;
  }
  return 1;
};

export default {
  getProjectIssues,
  getIssueWithUsersAndComments,
  create,
  update,
  remove,
};
