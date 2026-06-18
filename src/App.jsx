import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';
import ProjectView from './components/ProjectView';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import Blogs from './pages/Blogs';
import BlogView from './pages/BlogView';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsAppChat from './components/WhatsAppChat';

function App() {
  return (
    <HelmetProvider>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/project/:slug" element={<ProjectView />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blog/:slug" element={<BlogView />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
    <WhatsAppChat />
    </HelmetProvider>
  );
}

export default App;
