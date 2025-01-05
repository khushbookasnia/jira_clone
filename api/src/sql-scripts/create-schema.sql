DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_category') THEN
    CREATE TYPE project_category AS ENUM ('software', 'marketing', 'business');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_type') THEN
    CREATE TYPE issue_type AS ENUM ('task', 'bug', 'story');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_status') THEN
    CREATE TYPE issue_status AS ENUM ('backlog', 'selected', 'inprogress', 'done');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_priority') THEN
    CREATE TYPE issue_priority AS ENUM ('5', '4', '3', '2', '1');
  END IF;
END $$;