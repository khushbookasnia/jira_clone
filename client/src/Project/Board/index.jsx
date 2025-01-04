import { useLocation } from 'react-router-dom';

const ProjectBoard = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, mergeFilters] = useMergeState(defaultFilters);

  const matchPath = location.pathname;

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
      <Route
        path={`${matchPath}/issues/:issueId`}
        element={(routeProps) => (
          <Modal
            isOpen
            testid="modal:issue-details"
            width={1040}
            withCloseIcon={false}
            onClose={() => navigate(matchPath)}
            renderContent={(modal) => (
              <IssueDetails
                issueId={routeProps.params.issueId}
                projectUsers={project.users}
                fetchProject={fetchProject}
                updateLocalProjectIssues={updateLocalProjectIssues}
                modalClose={modal.close}
              />
            )}
          />
        )}
      />
    </Fragment>
  );
};

export default ProjectBoard;
