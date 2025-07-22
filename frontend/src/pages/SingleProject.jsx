import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ProjectComments from "../components/ProjectComments";
import "react-toastify/dist/ReactToastify.css";

function SingleProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Helper to get token from localStorage
  const token = localStorage.getItem("access_token");

  // Fetch current user info from /me with auth header
  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    fetch("http://localhost:5000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, [token]);

  // Fetch project info by id (no auth assumed needed here, add header if needed)
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/projects/${id}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((data) => {
        setProject(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load project");
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  // Permission check: user is admin or project owner
  const canManageMembers =
    currentUser &&
    project &&
    (currentUser.is_admin || currentUser.id === project.owner?.id);

  function handleAddMember() {
    if (!newMemberUsername.trim()) {
      toast.error("Please enter a username");
      return;
    }

    fetch(`http://localhost:5000/projects/${project.id}/members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: newMemberUsername.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add member");
        toast.success("Member added");
        setNewMemberUsername("");
        // Refresh project data to update members list
        return fetch(`http://localhost:5000/projects/${project.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => res.json())
      .then(setProject)
      .catch(() => toast.error("Failed to add member"));
  }

  function handleDeleteMember(memberId) {
    if (!window.confirm("Remove this member?")) return;

    fetch(`http://localhost:5000/projects/${project.id}/members/${memberId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove member");
        toast.success("Member removed");
        // Refresh project data to update members list
        return fetch(`http://localhost:5000/projects/${project.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => res.json())
      .then(setProject)
      .catch(() => toast.error("Failed to remove member"));
  }

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

        <div className="grid md:grid-cols-3 gap-4">
          {project.stack && (
            <div>
              <span className="text-gray-600 font-medium">Stack:</span>{" "}
              <span className="text-blue-700">{project.stack}</span>
            </div>
          )}

          {project.cohort?.name && (
            <div>
              <span className="text-gray-600 font-medium">Cohort:</span>{" "}
              <span className="text-green-700">{project.cohort.name}</span>
            </div>
          )}

          {project.owner && (
            <div>
              <span className="text-gray-600 font-medium">Owner:</span>{" "}
              <span className="text-purple-700">{project.owner.username}</span>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </div>

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

        {project.members && project.members.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Members</h2>
            <ul className="list-disc list-inside text-gray-700">
              {project.members.map((member) => (
                <li
                  key={member.id}
                  className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-default"
                >
                  <span className="text-gray-900 font-medium">{member.username}</span>
                  {canManageMembers && (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="ml-4 text-red-600 hover:text-red-800 text-sm font-semibold focus:outline-none"
                      title="Remove member"
                      aria-label={`Remove member ${member.username}`}
                    >
                      ✖
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {canManageMembers && (
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Username to add"
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddMember}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                >
                  Add Member
                </button>
              </div>
            )}
          </div>
        )}

        <ProjectComments projectId={project.id} />
      </div>
    </div>
  );
}

export default SingleProject;
