import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import ProjectView from './components/ProjectView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:slug" element={<ProjectView />} />
    </Routes>
  );
}

export default App;
