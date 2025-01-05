CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT,
  description TEXT,
  category project_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_projects (
  project_id INTEGER REFERENCES projects(id),
  user_id INTEGER REFERENCES users(id),
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type issue_type NOT NULL,
  status issue_status NOT NULL,
  priority issue_priority NOT NULL,
  list_position INTEGER NOT NULL,
  description TEXT,
  estimate INTEGER,
  time_spent INTEGER,
  reporter_id INTEGER REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issue_users (
  issue_id INTEGER REFERENCES issues(id),
  user_id INTEGER REFERENCES users(id),
  PRIMARY KEY (issue_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  issue_id INTEGER REFERENCES issues(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
