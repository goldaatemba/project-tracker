import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
// import { UserContext } from "../context/UserContext";

const api_url = "http://127.0.0.1:5000";

export default function ManageProjects() {
  const { auth_token } = localStorage.getItem("access_token");
  const token = localStorage.getItem("access_token");
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });

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
    if (!window.confirm("Are you sure you want to delete this project?")) return;
  
    fetch(`${api_url}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete project");
        toast.success("Project deleted successfully");
        fetchProjects(); 
      })
      .catch(() => toast.error("Error deleting project"));
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.title,
        description: formData.description,
        github_link: formData.link,
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
