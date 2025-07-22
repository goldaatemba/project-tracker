import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// import { api_url } from "../config.json";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const api_url = "http://127.0.0.1:5000"
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

  useEffect(() => {
    fetch(`${api_url}/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); 
        setUsers(Array.isArray(data) ? data : []); 
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        setUsers([]); 
      });
  }, [auth_token]);

  const handleDelete = (userId) => {
    fetch(`${api_url}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete user");
        toast.success("User deleted!");
        setUsers(users.filter((user) => user.id !== userId)); 
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      });
  };

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="text-blue-800"><strong>Name:</strong> {user.name}</p>
              <p className="text-blue-600"><strong>Email:</strong> {user.email}</p>
            </div>
            <button
              onClick={() => handleDelete(user.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}