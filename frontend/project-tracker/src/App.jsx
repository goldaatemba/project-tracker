import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import About from './pages/about';
import ProjectForm from './pages/addProject';
import  CohortProjects  from './pages/cohorts';
import  Projects  from './pages/projects';
import Layout from './components/Layout';
import { AdminDashboard, ManageCohorts, ManageProjects } from './pages/admin';
import './App.css'


function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route path='/addProject' element={<ProjectForm />} />
          <Route path="/cohort" element={<CohortProjects />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<ManageProjects />} />
          <Route path="/admin/cohorts" element={<ManageCohorts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
