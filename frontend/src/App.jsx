import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './pages/HomePage';
import NoPage from './pages/NoPage';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { AdminDashboard , ManageProjects, ManageUsers } from './pages/Admin';
import About from './pages/About';
import Projects from './pages/Projects';
import CohortProjects from './pages/Cohorts';
import ProjectForm from './pages/AddProjects';
import SingleProject from './pages/SingleProject';
import ManageCohorts from './components/ManageCohorts';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import EditProfile from './pages/EditProfile';
import Blocked from './pages/Blocked';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <Routes>
      <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NoPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/cohorts" element={<CohortProjects />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/addproject" element={<ProjectForm />} />
      <Route path="/projects/:id" element={<SingleProject />} />
      <Route path="/about" element={<About />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/admin/manage-cohorts" element={<ManageCohorts />} />
      <Route path="/admin/manage-projects" element={<ManageProjects />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/blocked" element={<Blocked />} />
      </Route>
    </Routes>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </>
  )
}

export default App
