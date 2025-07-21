import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedStack, setSelectedStack] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((error) => {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      });
  }, []);

  const stacks = ["All", "Fullstack", "Android"];
  const filteredProjects =
    selectedStack === "All"
      ? projects
      : projects.filter((project) =>
          project.stack.toLowerCase().includes(selectedStack.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f1fa] to-white py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#043873] mb-4">
            Explore Student Projects
          </h1>
          <p className="text-gray-600 text-4xl md:text-base max-w-2xl">
            Browse innovative projects built by Moringa School students across
            various cohorts. Tap into their creativity, stack choices, and
            execution!
          </p>
        </div>

        {/* Filters & Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex gap-4 flex-wrap justify-center">
            <select
              className="p-2 border border-blue-300 rounded bg-white shadow-sm"
              onChange={(e) => setSelectedStack(e.target.value)}
            >
              {stacks.map((stack) => (
                <option key={stack} value={stack}>
                  {stack}
                </option>
              ))}
            </select>

            <select className="p-2 border border-blue-300 rounded bg-white shadow-sm">
              <option value="">Tech Stack</option>
              <option value="react">React</option>
              <option value="flask">Flask</option>
              <option value="django">Django</option>
              <option value="node">Node.js</option>
            </select>
          </div>

          <Link
            to="/addproject"
            className="bg-green-600 hover:bg-green-500 transition text-white font-semibold py-2 px-6 rounded shadow"
          >
            + Add Project
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Projects;