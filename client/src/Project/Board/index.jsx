import React, { Fragment } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import useMergeState from 'shared/hooks/mergeState';
import { Breadcrumbs } from 'shared/components';
import Header from './Header/index';
import Filters from './Filters/index';
import Lists from './Lists/index';

const defaultFilters = {
  // Add your default filters here
};

const ProjectBoard = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, mergeFilters] = useMergeState(defaultFilters);

  return (
    <Fragment>
      <Breadcrumbs items={['Projects', project.name, 'Kanban Board']} />
      <Header />
      <Filters
        projectUsers={project.users}
        defaultFilters={defaultFilters}
        filters={filters}
        mergeFilters={mergeFilters}
      />
      <Lists
        project={project}
        filters={filters}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />

      <Routes>
        <Route
          path="issues/:issueId"
          element={
            <IssueDetailsModal
              project={project}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
              onClose={() => navigate('../')}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

const IssueDetailsModal = ({
  project,
  issueId,
  fetchProject,
  updateLocalProjectIssues,
  onClose,
}) => (
  <Modal
    isOpen
    testid="modal:issue-details"
    width={1040}
    withCloseIcon={false}
    onClose={onClose}
    renderContent={(modal) => (
      <IssueDetails
        issueId={issueId}
        projectUsers={project.users}
        fetchProject={fetchProject}
        updateLocalProjectIssues={updateLocalProjectIssues}
        modalClose={modal.close}
      />
    )}
  />
);

export default ProjectBoard;
