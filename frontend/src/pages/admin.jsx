import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { api_url } from "../config.json";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

export function AdminDashboard() {
  const dashboardItems = [
    { to: "/admin/manage-cohorts", title: "Manage Cohorts", description: "Add, edit, or delete cohorts." },
    { to: "/admin/manage-projects", title: "Manage Projects", description: "View and manage all projects." },
    { to: "/admin/manage-users", title: "Manage Users", description: "Add, edit, or delete users." }
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
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetch(`${api_url}/cohorts`, {
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => res.json())
      .then(setCohorts)
      .catch(() => toast.error("Failed to load cohorts"));
  }, [auth_token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${api_url}/cohorts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create cohort");
        toast.success("Cohort created!");
        setFormData({ name: '', description: '' });
        return res.json();
      })
      .then((newCohort) => setCohorts(prev => [...prev, newCohort]))
      .catch(() => toast.error("Failed to create cohort"));
  };

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Cohorts</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">Create Cohort</button>
      </form>
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

export function ManageUsers() {
  const { auth_token } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    fetch(`${api_url}/users`, {
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"));
  }, [auth_token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${api_url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create user");
        toast.success("User created!");
        setFormData({ name: '', email: '' });
        return res.json();
      })
      .then((newUser) => setUsers(prev => [...prev, newUser]))
      .catch(() => toast.error("Failed to create user"));
  };

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Users</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">Create User</button>
      </form>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-blue-800"><strong>Name:</strong> {user.name}</p>
            <p className="text-blue-600"><strong>Email:</strong> {user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
