import pick from 'lodash/pick';

import { Issue } from 'entities';

export const issuePartial = (issue: Issue): Partial<Issue> =>
  pick(issue, [
    'id',
    'title',
    'type',
    'status',
    'priority',
    'listPosition',
    'createdAt',
    'updatedAt',
    'userIds',
  ]);
