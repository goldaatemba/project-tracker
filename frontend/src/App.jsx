import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import NoPage from './pages/NoPage';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { AdminDashboard } from './pages/Admin';
import About from './pages/About';
import Projects from './pages/Projects';
import CohortProjects from './pages/Cohorts';
import ProjectForm from './pages/AddProjects';
import SingleProject from './pages/SingleProject';


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
      </Route>
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
