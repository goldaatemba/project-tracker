import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { api_url } from "../config.json";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

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
  const { auth_token } = useContext(UserContext);
  const [cohorts, setCohorts] = useState([]);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetch(`${api_url}/cohorts`, {
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => res.json())
      .then(setCohorts)
      .catch(() => toast.error("Failed to load cohorts"));
  }, [auth_token]);

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Cohort name cannot be empty");
      return;
    }

    fetch(`${api_url}/cohorts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ name: formData.name.trim() }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then(data => { throw new Error(data.error || "Failed to create cohort") });
        return res.json();
      })
      .then((newCohort) => {
        toast.success("Cohort created!");
        setCohorts((prev) => [...prev, { id: newCohort.id, name: formData.name.trim() }]);
        setFormData({ name: "" });
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Cohorts</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Cohort name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Cohort
        </button>
      </form>

      <ul>
        {cohorts.map((cohort) => (
          <li key={cohort.id}>{cohort.name}</li>
        ))}
      </ul>
    </div>
  );
}


export function ManageProjects() {
  const { auth_token } = useContext(UserContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${api_url}/projects`, {
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => toast.error("Failed to load projects"));
  }, [auth_token]);

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Projects</h1>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-blue-800"><strong>Name:</strong> {project.name}</p>
            <p className="text-blue-600"><strong>Description:</strong> {project.description}</p>
            <p className="text-blue-600"><strong>GitHub Link:</strong> {project.github_link}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}