import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch project"))
      .then((data) => {
        setProject({
          title: data.name,
          description: data.description,
          link: data.github_link,
        });
        setMembers(data.members || []);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load project data.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: project.title,
      description: project.description,
      github_link: project.link,
    };

    fetch(`${API_URL}/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Update failed"))
      .then(() => {
        toast.success("Project updated!");
        setTimeout(() => navigate(`/projects/${id}`), 1500);
      })
      .catch((err) => toast.error(err));
  };

  const handleRemoveMember = (userId) => {
    fetch(`${API_URL}/projects/${id}/remove_member`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Remove failed"))
      .then(() => {
        setMembers(members.filter((m) => m.id !== userId));
        toast.success("Member removed!");
      })
      .catch((err) => toast.error(err));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Edit Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={project.title}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={project.description}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
        <input
          type="url"
          name="link"
          placeholder="GitHub Link"
          value={project.link}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Save Changes
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Project Members</h3>
        {members.length === 0 ? (
          <p className="text-gray-500">No members yet.</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
              >
                <span className="text-gray-700">{member.username || member.email}</span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default EditProject;
