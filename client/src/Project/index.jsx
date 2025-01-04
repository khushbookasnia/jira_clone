import React from 'react';
import { Route, Navigate, useMatch, useNavigate, useParams, Routes } from 'react-router-dom'; // Updated imports

import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, PageError, Modal } from 'shared/components';

import NavbarLeft from './NavbarLeft';
import Sidebar from './Sidebar';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import { ProjectPage } from './Styles';

const Project = () => {
  const match = useMatch('project');
  const navigate = useNavigate();
  const params = useParams();

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/project');

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { project } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData((currentData) => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  if (!match) return null;

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
      />
      <Sidebar project={project} />
      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}
      {issueCreateModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={issueCreateModalHelpers.close}
          renderContent={(modal) => (
            <IssueCreate
              project={project}
              fetchProject={fetchProject}
              onCreate={() => navigate(`${params.projectId}/board`)} // Use params for dynamic part
              modalClose={modal.close}
            />
          )}
        />
      )}
      <Routes>
        <Route
          path={`${match?.path}/board`}
          element={
            <Board
              project={project}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
            />
          } // Replaced render with element
        />
        <Route
          path={`${match?.path}/settings`}
          element={<ProjectSettings project={project} fetchProject={fetchProject} />} // Replaced render with element
        />
      </Routes>
      {match?.isExact && <Navigate to={`${match.url}/board`} />}{' '}
      {/* Replaced Redirect with Navigate */}
    </ProjectPage>
  );
};

export default Project;
