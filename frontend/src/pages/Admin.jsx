import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Admin Dashboard
export function AdminDashboard() {
  const dashboardItems = [
    {
      to: "/admin/manage-cohorts",
      title: "Manage Cohorts",
      description: "Add, edit, or delete cohorts."
    },
    {
      to: "/admin/manage-projects",
      title: "Manage Projects",
      description: "View and manage all projects."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 border-b-4 border-blue-300 pb-2 mb-6">Admin Dashboard</h1>
        <p className="text-blue-800 mb-8 text-lg">Welcome Admin! Choose a section to manage:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-blue-100 hover:border-blue-300"
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">{item.title}</h2>
              <p className="text-blue-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Manage Cohorts
export function ManageCohorts() {
  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    fetch("/api/cohorts")
      .then((res) => res.json())
      .then(setCohorts)
      .catch(() => console.error("Failed to load cohorts"));
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 border-b-4 border-blue-300 pb-2 mb-6">Manage Cohorts</h1>
        <ul className="space-y-5">
          {cohorts.map((cohort) => (
            <li key={cohort.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-800">{cohort.name}</h3>
              <p className="text-blue-600 mt-1">{cohort.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Manage Projects
export function ManageProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => console.error("Failed to load projects"));
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 border-b-4 border-blue-300 pb-2 mb-6">Manage Projects</h1>
        <ul className="space-y-5">
          {projects.map((project) => (
            <li key={project.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-800">{project.name}</h3>
              <p className="text-blue-600 mt-1">{project.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}