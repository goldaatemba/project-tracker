import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedStack, setSelectedStack] = useState("All");
  const [selectedCohort, setSelectedCohort] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

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
  const cohorts = ["All", "SDF-PT-01", "SDF-FT-04", "SE-PT-10"]; // Add actual cohort values from your DB

  const filteredProjects = projects
    .filter((project) =>
      selectedStack === "All"
        ? true
        : project.stack?.toLowerCase().includes(selectedStack.toLowerCase())
    )
    .filter((project) =>
      selectedCohort === "All"
        ? true
        : project.cohort?.name === selectedCohort
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
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
            {/* Stack Filter */}
            <select
              className="p-2 border border-blue-300 rounded bg-white shadow-sm"
              onChange={(e) => setSelectedStack(e.target.value)}
              value={selectedStack}
            >
              {stacks.map((stack) => (
                <option key={stack} value={stack}>
                  {stack}
                </option>
              ))}
            </select>

            {/* Cohort Filter */}
            <select
              className="p-2 border border-blue-300 rounded bg-white shadow-sm"
              onChange={(e) => setSelectedCohort(e.target.value)}
              value={selectedCohort}
            >
              {cohorts.map((cohort) => (
                <option key={cohort} value={cohort}>
                  {cohort}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <select
              className="p-2 border border-blue-300 rounded bg-white shadow-sm"
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
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

    </div>
  );
}

export default Projects;
