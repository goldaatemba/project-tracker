import { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedStack, setSelectedStack] = useState("All");

  useEffect(() => {
    fetch('http://localhost:3001/projects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => setProjects(data))
      .catch(error => console.error("Error fetching projects:", error));
  }, []);

  const stacks = ["All", "Fullstack", "Android"];

  const filteredProjects = selectedStack === "All"
    ? projects
    : projects.filter(project => project.stack.toLowerCase().includes(selectedStack.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f1fa] to-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative bg-white rounded-2xl shadow-xl px-6 py-10 md:px-10 md:py-14 mb-12 border border-blue-100 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)',
            backgroundBlendMode: 'overlay',
          }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#043873] text-center mb-4">
             Explore Student Projects
          </h1>
          <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Browse innovative projects built by Moringa School students across various cohorts. Tap into their creativity, stack choices, and execution!
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          {stacks.map(stack => (
            <button
              key={stack}
              className={`px-4 py-2 rounded-full border ${
                selectedStack === stack
                  ? "bg-[#043873] text-white"
                  : "bg-white text-[#043873] border-[#043873]"
              } transition duration-200`}
              onClick={() => setSelectedStack(stack)}
            >
              {stack}
            </button>
          ))}
        </div>

        {/* Project Grid */}
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
