import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api_url } from "../config.json";


const api_url = "https://project-bank-db99.onrender.com";
const auth_token = localStorage.getItem("token");

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [filters, setFilters] = useState({ user: "", cohort: "", stack: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", link: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetch(`${api_url}/users`).then(res => res.json()).then(setUsers);
    fetch(`${api_url}/cohorts`).then(res => res.json()).then(setCohorts);
  }, []);

  const fetchProjects = () => {
    fetch(`${api_url}/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        const uniqueStacks = [...new Set(data.map(p => p.stack).filter(Boolean))];
        setStacks(uniqueStacks);
      })
      .catch(() => toast.error("Failed to load projects"));
  };

  useEffect(() => {
    const filtered = projects.filter(p =>
      (!filters.user || p.owner === filters.user) &&
      (!filters.cohort || p.cohort?.name === filters.cohort) &&
      (!filters.stack || p.stack === filters.stack)
    );
    setFilteredProjects(filtered);
  }, [projects, filters]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    fetch(`${api_url}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth_token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        toast.success("Project deleted!");
        fetchProjects();
      })
      .catch(() => toast.error("Delete failed"));
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
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        link: formData.link,
      }),
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
    <div className="p-6 bg-blue-50 min-h-screen">
      <button
      onClick={() => navigate("/admin")}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
    >
      Return
    </button>
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Manage Projects</h2>

      <div className="flex flex-wrap gap-4 mb-8">
        <select
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
          className="p-2 rounded-md border border-gray-300 bg-white shadow-sm"
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, cohort: e.target.value })}
          className="p-2 rounded-md border border-gray-300 bg-white shadow-sm"
        >
          <option value="">All Cohorts</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, stack: e.target.value })}
          className="p-2 rounded-md border border-gray-300 bg-white shadow-sm"
        >
          <option value="">All Stacks</option>
          {stacks.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-blue-700">{project.name}</h3>
            <p className="text-gray-700 mt-2">{project.description}</p>
            <div className="text-sm text-gray-600 mt-3">
              <p><strong>Owner:</strong> {project.owner}</p>
              <p><strong>Cohort:</strong> {project.cohort?.name}</p>
              <p><strong>Stack:</strong> {project.stack}</p>
              <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleEdit(project)}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <form onSubmit={handleUpdate} className="mt-12 space-y-4 border-t pt-6 max-w-xl">
          <h3 className="text-xl font-semibold text-blue-800">Edit Project</h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="block w-full p-2 border rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="block w-full p-2 border rounded-md"
            required
          />
          <input
            type="url"
            placeholder="GitHub Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="block w-full p-2 border rounded-md"
            required
          />
          <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

export default ManageProjects;
