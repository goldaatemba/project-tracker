import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SingleProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`)
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
      });
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ToastContainer />
        <p className="text-gray-500 text-lg">Loading project...</p>
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

        <div className="grid md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}

export default SingleProject;
