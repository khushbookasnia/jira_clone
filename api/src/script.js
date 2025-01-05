const { neon } = require('@neondatabase/serverless');

const sql = neon(
  'postgresql://jira_development_owner:g6mhyN9TOjQn@ep-fragrant-art-a19fjmxa.ap-southeast-1.aws.neon.tech/jira_development?sslmode=require',
);

const IssueType = {
  TASK: 'task',
  BUG: 'bug',
  STORY: 'story',
};

const IssueStatus = {
  BACKLOG: 'backlog',
  SELECTED: 'selected',
  INPROGRESS: 'inprogress',
  DONE: 'done',
};

const IssuePriority = {
  HIGHEST: '5',
  HIGH: '4',
  MEDIUM: '3',
  LOW: '2',
  LOWEST: '1',
};

const ProjectCategory = {
  SOFTWARE: 'software',
  MARKETING: 'marketing',
  BUSINESS: 'business',
};

async function seedUsers() {
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

  const insertedUsers = [];
  for (const user of users) {
    const [insertedUser] = await sql`
      INSERT INTO users (email, name, avatar_url)
      VALUES (${user.email}, ${user.name}, ${user.avatarUrl})
      RETURNING *;
    `;
    insertedUsers.push(insertedUser);
  }
  return insertedUsers;
}

async function seedProject(users) {
  const [project] = await sql`
    INSERT INTO projects (name, url, description, category)
    VALUES (
      'singularity 1.0',
      'https://www.atlassian.com/software/jira',
      'Plan, track, and manage your agile and software development projects in Jira. Customize your workflow, collaborate, and release great software.',
      ${ProjectCategory.SOFTWARE}
    )
    RETURNING *;
  `;

  for (const user of users) {
    await sql`
      INSERT INTO users_projects (project_id, user_id)
      VALUES (${project.id}, ${user.id});
    `;
  }

  return project;
}

async function seedIssues(project, users) {
  const issues = [
    {
      title: 'This is an issue of type: Task.',
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.HIGH,
      listPosition: 1,
      description: `<p>Your teams can collaborate in Jira applications by breaking down pieces of work into issues. Issues can represent tasks, software bugs, feature requests or any other type of project work.</p>`,
      estimate: 8,
      timeSpent: 4,
      reporterId: users[1].id,
      assignees: [users[0].id],
    },
    // Add more issues following the same pattern...
  ];

  const insertedIssues = [];
  for (const issue of issues) {
    const [insertedIssue] = await sql`
      INSERT INTO issues (
        title, type, status, priority, list_position, description,
        estimate, time_spent, reporter_id, project_id
      )
      VALUES (
        ${issue.title}, ${issue.type}, ${issue.status}, ${issue.priority},
        ${issue.listPosition}, ${issue.description}, ${issue.estimate},
        ${issue.timeSpent}, ${issue.reporterId}, ${project.id}
      )
      RETURNING *;
    `;

    if (issue.assignees) {
      for (const assigneeId of issue.assignees) {
        await sql`
          INSERT INTO issue_users (issue_id, user_id)
          VALUES (${insertedIssue.id}, ${assigneeId});
        `;
      }
    }

    insertedIssues.push(insertedIssue);
  }

  return insertedIssues;
}

async function seedComments(issues, users) {
  const comments = [
    {
      body: 'An old silent pond...\nA frog jumps into the pond,\nsplash! Silence again.',
      issueId: issues[0].id,
      userId: users[2].id,
    },
    // Add more comments following the same pattern...
  ];

  for (const comment of comments) {
    await sql`
      INSERT INTO comments (body, user_id, issue_id)
      VALUES (${comment.body}, ${comment.userId}, ${comment.issueId});
    `;
  }
}

async function main() {
  try {
    console.log('Seeding users...');
    const users = await seedUsers();

    console.log('Seeding project...');
    const project = await seedProject(users);

    console.log('Seeding issues...');
    const issues = await seedIssues(project, users);

    console.log('Seeding comments...');
    await seedComments(issues, users);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
