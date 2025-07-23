import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      fetch(`http://localhost:5000/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.ok ? res.json() : Promise.reject("Failed to fetch project")),

      fetch("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.ok ? res.json() : Promise.reject("Failed to fetch users")),
    ])
      .then(([projectData, usersData]) => {
        setProject({
          title: projectData.name,
          description: projectData.description,
          link: projectData.github_link,
        });
        setMembers(projectData.members || []);
        setAllUsers(usersData);
        setError("");
      })
      .catch(err => {
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

    fetch(`http://localhost:5000/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.ok ? res.json() : Promise.reject("Update failed"))
      .then(() => {
        toast.success("Project updated!");
        setTimeout(() => navigate(`/projects/${id}`), 1500);
      })
      .catch(err => toast.error(err));
  };

  const handleAddMember = (userId) => {
    fetch(`http://localhost:5000/projects/${id}/add_member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then(res => res.ok ? res.json() : Promise.reject("Add failed"))
      .then((data) => {
        setMembers([...members, data]);
        toast.success("Member added!");
      })
      .catch(err => toast.error(err));
  };

  const handleRemoveMember = (userId) => {
    fetch(`http://localhost:5000/projects/${id}/remove_member`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then(res => res.ok ? res.json() : Promise.reject("Remove failed"))
      .then(() => {
        setMembers(members.filter(m => m.id !== userId));
        toast.success("Member removed!");
      })
      .catch(err => toast.error(err));
  };

  const remainingUsers = allUsers.filter(
    (user) => !members.some((member) => member.id === user.id)
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold mb-6">Edit Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={project.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={project.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          rows={4}
          required
        />
        <input
          type="url"
          name="link"
          placeholder="GitHub Link"
          value={project.link}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>

      {/* Member Management Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Project Members</h3>
        {members.length === 0 && <p className="text-gray-500">No members yet.</p>}
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{member.username || member.email}</span>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <h4 className="text-lg font-medium mt-6">Add Member</h4>
        <ul className="space-y-2">
          {remainingUsers.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded"
            >
              <span>{user.username || user.email}</span>
              <button
                onClick={() => handleAddMember(user.id)}
                className="text-green-600 hover:underline"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default EditProject;
