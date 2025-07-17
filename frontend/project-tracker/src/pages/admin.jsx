import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const dashboardItems = [
    { to: "/admin/manage-cohorts", title: "Manage Cohorts", description: "Add, edit, or delete cohorts." },
    { to: "/admin/manage-projects", title: "Manage Projects", description: "View and manage all projects." },
  ];

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Admin Dashboard</h1>
      <p className="text-blue-800 mb-6">Welcome Admin! Choose a section to manage:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-800">{item.title}</h2>
            <p className="text-blue-600 mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ManageCohorts() {
  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    fetch("api/cohorts")
      .then((res) => res.json())
      .then(setCohorts)
      .catch(() => console.error("Failed to load cohorts"));
  }, []);

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Cohorts</h1>
      <ul className="space-y-4">
        {cohorts.map((cohort) => (
          <li key={cohort.id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-blue-800"><strong>Name:</strong> {cohort.name}</p>
            <p className="text-blue-600"><strong>Description:</strong> {cohort.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ManageProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => console.error("Failed to load projects"));
  }, []);

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Projects</h1>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-blue-800"><strong>Name:</strong> {project.name}</p>
            <p className="text-blue-600"><strong>Description:</strong> {project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
