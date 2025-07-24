import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "/projecthero.png";
import colabImg from "/colab.png"; 
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/projects?featured=true&_limit=3`)
      .then((res) => res.json())
      .then((data) => setFeaturedProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-gray-100 text-gray-800">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-600 rounded-3xl px-8 py-10 shadow-2xl mb-10 max-w-4xl w-full"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-snug tracking-tight">
            Track, Share, and Explore Student Projects
          </h1>
        </motion.div>

        <h2 className="text-2xl md:text-3xl text-blue-800 font-semibold mb-5">
          Never Let a Great Project Be Forgotten
        </h2>

        <p className="text-gray-800 max-w-2xl mb-10 text-lg leading-relaxed">
          Project Tracker is your central hub to upload, browse, and revisit all student projects across Moringa School cohorts.
          Whether you're looking to get inspired, collaborate, or showcase your work — we've got you covered.
        </p>

        <Link
          to="/register"
          className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white text-lg px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105 duration-300"
        >
          Get Started
        </Link>

        <div className="mt-16">
          <img
            src={colabImg}
            alt="Students collaborating"
            className="w-full max-w-md mx-auto rounded-xl shadow-xl"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl rounded-xl md:text-5xl font-bold mb-6 text-[#4F9CF9] leading-tight">
            Explore Moringa Projects
          </h2>
          <p className="text-lg text-gray-800 mb-6">
            Discover brilliant innovations built by Moringa School students. Dive into diverse tech stacks, meet creators, and submit your own work.
          </p>
          <div className="space-x-4">
            <Link
              to="/projects"
              className="bg-[#FFE602] text-gray-800 font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-300 transition"
            >
              Browse Projects
            </Link>
            <Link
              to="/addproject"
              className="border border-[#4F9CF9] text-[#4F9CF9] font-semibold px-6 py-3 rounded-lg hover:bg-[#4F9CF9] hover:text-white transition"
            >
              Submit Project
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={heroImg}
            alt="Illustration representing student tech projects"
            className="w-full max-w-md md:max-w-full"
          />
        </motion.div>
      </div>

      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#4F9CF9] mb-10">
            Featured Projects
          </h2>
          {featuredProjects.length === 0 ? (
            <p className="text-center text-gray-600">No featured projects available.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
  {featuredProjects.slice(0, 3).map((project) => (
    <motion.div
      key={project.id}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-semibold text-[#043873]">{project.name}</h3>
          <p className="text-sm text-gray-800 mb-2">
            {project.description
              ? project.description.length > 60
                ? project.description.slice(0, 60).split(" ").slice(0, -1).join(" ") + "..."
                : project.description
              : "No description provided."}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-700">
            <strong>By ~ </strong> {project.owner}
          </p>
          <Link
            to={`/projects/${project.id}`}
            className="text-sm text-[#4F9CF9] hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#4F9CF9] text-white text-center py-6 mt-10">
        <p className="text-md">
          Are you an admin?{" "}
          <Link to="/admin" className="underline font-semibold">
            Go to Admin Dashboard
          </Link>
        </p>
      </div>
    </section>
  );
}
