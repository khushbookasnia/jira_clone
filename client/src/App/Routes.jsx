import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/project" replace />} />
      <Route path="/authenticate" element={<Authenticate />} />
      <Route path="/project" element={<Project />} />
      <Route path="*" element={<PageError />} />
    </Routes>
  </Router>
);

export default AppRoutes;
