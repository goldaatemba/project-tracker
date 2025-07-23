import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api_url } from "../config.json";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [techs, setTechs] = useState(["All"]);
  const [cohorts, setCohorts] = useState(["All"]);
  const [selectedTech, setSelectedTech] = useState("All");
  const [selectedCohort, setSelectedCohort] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetch("https://project-bank-db99.onrender.com/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        setProjects(data);

        const uniqueTechs = new Set(data.map((p) => p.stack).filter(Boolean));
        const uniqueCohorts = new Set(
          data.map((p) => p.cohort?.name).filter(Boolean)
        );

        setTechs(["All", ...Array.from(uniqueTechs)]);
        setCohorts(["All", ...Array.from(uniqueCohorts)]);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load projects.");
      });
  }, []);

  const filteredProjects = projects
    .filter((project) =>
      selectedTech === "All"
        ? true
        : project.stack?.toLowerCase() === selectedTech.toLowerCase()
    )
    .filter((project) =>
      selectedCohort === "All"
        ? true
        : project.cohort?.name === selectedCohort
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f1fa] to-white py-8 px-4 md:px-10">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#043873] mb-4">
            Explore Student Projects
          </h1>
          <p className="text-gray-600 text-4xl md:text-base max-w-2xl">
            Browse innovative projects built by Moringa School students across
            various cohorts.
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex gap-4 flex-wrap justify-center">
            {/* Tech Filter */}
            <select
              className="p-2 border border-blue-300 rounded bg-white shadow-sm"
              onChange={(e) => setSelectedTech(e.target.value)}
              value={selectedTech}
            >
              {techs.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
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

          {/* Add Project */}
          <Link
            to="/addproject"
            className="bg-green-600 hover:bg-green-500 transition text-white font-semibold py-2 px-6 rounded shadow"
          >
            + Add Project
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No projects found.
            </p>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
