import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ProjectComments from "../components/ProjectComments";
import "react-toastify/dist/ReactToastify.css";
const API_URL = import.meta.env.VITE_API_URL;



function SingleProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(setCurrentUser)
      .catch(() => console.error("Could not fetch user"));
  }, [token]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then(setProject)
      .catch(() => toast.error("Failed to load project"))
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setAvailableUsers)
      .catch(() => toast.error("Could not load users"));
  }, [token]);

  const canManageMembers =
    currentUser &&
    project &&
    (currentUser.is_admin || currentUser.id === project.owner?.id);

  const handleAddMember = () => {
    if (!newMemberUsername.trim()) {
      toast.error("Please select a user");
      return;
    }

    fetch(`${API_URL}/projects/${project.id}/members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: newMemberUsername.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        toast.success("Member added");
        setNewMemberUsername("");
        return fetch(`${API_URL}/projects/${project.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then(setProject)
      .catch(() => toast.error("Failed to add member"));
  };

  const handleDeleteMember = (memberId) => {
    if (!window.confirm("Remove this member?")) return;

    fetch(`${API_URL}/projects/${project.id}/members/${memberId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(() =>
        fetch(`${API_URL}/projects/${project.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
      .then((res) => res.json())
      .then(setProject)
      .catch(() => toast.error("Failed to remove member"));
  };

  const handleDeleteProject = () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    fetch(`${API_URL}/projects/${project.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete project");
        toast.success("Project deleted successfully");
        navigate("/projects");
      })
      .catch(() => toast.error("Error deleting project"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ToastContainer />
        <p className="text-gray-500 text-lg">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ToastContainer />
        <p className="text-red-500 text-lg">Project not found.</p>
      </div>
    );
  }

  const nonMemberUsers = availableUsers.filter(
    (u) => !project.members.some((m) => m.id === u.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <Link
          to="/projects"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Back to Projects
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#043873] mb-1">
              {project.name}
            </h1>
            <p className="text-sm text-gray-400">
              Created on{" "}
              {new Date(project.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {canManageMembers && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/edit-project/${project.id}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteProject}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-600 font-medium">Stack:</span>{" "}
            <span className="text-blue-700">
              {project.stack || <span className="text-gray-400">N/A</span>}
            </span>
          </div>

          <div>
            <span className="text-gray-600 font-medium">Cohort:</span>{" "}
            <span className="text-green-700">
              {project.cohort?.name || <span className="text-gray-400">Unassigned</span>}
            </span>
          </div>

          <div>
            <span className="text-gray-600 font-medium">Owner:</span>{" "}
            <span className="text-purple-700">
              {project.owner?.username || <span className="text-gray-400">Unknown</span>}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>

        {project.github_link ? (
          <div className="pt-4">
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#043873] hover:bg-[#022d5b] text-white font-semibold px-5 py-2 rounded-lg transition"
            >
              🔗 View on GitHub
            </a>
          </div>
        ) : (
          <p className="pt-4 text-sm text-gray-400 italic">
            No GitHub link provided
          </p>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Members</h2>
          <ul className="list-disc list-inside text-gray-700">
            {project.members?.map((member) => (
              <li
                key={member.id}
                className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <span className="text-gray-900 font-medium">
                  {member.username}
                </span>
                {canManageMembers && (
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    ✖
                  </button>
                )}
              </li>
            ))}
          </ul>

          {canManageMembers && (
            <div className="mt-4 flex items-center space-x-2">
              <select
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-grow"
              >
                <option value="">Select user to add</option>
                {nonMemberUsers.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddMember}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Add Member
              </button>
            </div>
          )}
        </div>

        <ProjectComments projectId={project.id} />
      </div>
    </div>
  );
}

export default SingleProject;
