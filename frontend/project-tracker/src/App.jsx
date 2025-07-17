// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Licensing from './pages/Licensing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Access from './pages/Project';
import SingleAccess from './pages/SingleProject';
import AddAccess from './pages/AddProject';

// Layout and Context
import Layout from './components/Layout';
import { UserProvider } from './context/UserContext';
import { AccessProvider } from './context/ProjectContext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Static Pages */}
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="licensing" element={<Licensing />} />

              {/* Authentication */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* User Area */}
              <Route path="profile" element={<Profile />} />
              <Route path="users" element={<Users />} />

              {/* Project Management */}
              <Route path="projects" element={<Project />} />
              <Route path="projects/:id" element={<SingleProject />} />
              <Route path="addproject" element={<AddProject />} />
            </Route>
          </Routes>
        </ProjectProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;


