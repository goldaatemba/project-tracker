import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { api_url } from "../config.json";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

// const api_url = "http://127.0.0.1:5000";

export function AdminDashboard() {
  const dashboardItems = [
    { to: "/admin/manage-cohorts", title: "Manage Cohorts", description: "Add, edit, or delete cohorts." },
    { to: "/admin/manage-projects", title: "Manage Projects", description: "View and manage all projects." },
    { to: "/admin/manage-users", title: "Manage Users", description: "Add, edit, or delete users." },
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

export default function ManageProjects() {
  const { auth_token } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", link: "" });

  const fetchProjects = () => {
    fetch(`${api_url}/projects`, {
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to load projects"))
      .then(setProjects)
      .catch(() => toast.error("Could not fetch projects"));
  };

  useEffect(() => {
    fetchProjects();
  }, [auth_token]);

  const handleDelete = (id) => {
    fetch(`${api_url}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        toast.success("Project deleted");
        fetchProjects();
      })
      .catch(() => toast.error("Failed to delete project"));
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.name,
      description: project.description,
      link: project.github_link,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`${api_url}/projects/${editingProject.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        toast.success("Project updated!");
        setEditingProject(null);
        setFormData({ title: "", description: "", link: "" });
        fetchProjects();
      })
      .catch(() => toast.error("Failed to update project"));
  };

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Projects</h1>

      {editingProject && (
        <form onSubmit={handleUpdate} className="space-y-4 mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-blue-800">Edit Project</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          <input
            type="text"
            placeholder="GitHub Link"
            className="w-full p-2 border rounded"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">Update</button>
            <button type="button" onClick={() => setEditingProject(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-blue-800"><strong>Title:</strong> {project.name}</p>
            <p className="text-blue-600"><strong>Description:</strong> {project.description}</p>
            <p className="text-blue-600">
              <strong>GitHub:</strong>{" "}
              <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {project.github_link}
              </a>
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(project)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(project.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ManageUsers() {
  const { auth_token } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch(`${api_url}/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {
        toast.error("Failed to load users");
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [auth_token]);

  const handleDelete = (userId) => {
    fetch(`${api_url}/delete_user_profile/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to delete user");
        }
        return res.json();
      })
      .then(() => {
        toast.success("User deleted!");
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((err) => {
        toast.error(err.message || "Failed to delete user");
        console.error("Delete user error:", err);
      });
  };

  const toggleBlock = (userId, currentStatus) => {
    fetch(`${api_url}/update_user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ is_blocked: !currentStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update user status");
        toast.success("User status updated!");
        fetchUsers();
      })
      .catch(() => toast.error("Failed to update user"));
  };

  return (
    <div className="bg-blue-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Manage Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="text-blue-800">
                <strong>Username:</strong> {user.username}
              </p>
              <p className="text-blue-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-blue-600">
                <strong>Status:</strong> {user.is_blocked ? "Blocked" : "Active"}
              </p>
              <p className="text-blue-600">
                <strong>Admin:</strong> {user.is_admin ? "Yes" : "No"}
              </p>
              <p className="text-blue-600">
                <strong>Cohort ID:</strong> {user.cohort_id || "None"}
              </p>
              <p className="text-blue-600">
                <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleBlock(user.id, user.is_blocked)}
                className={`${user.is_blocked ? "bg-green-500" : "bg-yellow-500"} hover:opacity-90 text-white font-bold py-2 px-4 rounded`}
              >
                {user.is_blocked ? "Unblock" : "Block"}
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
