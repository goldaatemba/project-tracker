import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "/hero-graphic.png";
import config from "../config"; 

function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/projects?featured=true&_limit=3`)
      .then((res) => res.json())
      .then((data) => setFeaturedProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <section className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl rounded-xl md:text-5xl font-bold mb-6 text-[#4F9CF9] leading-tight">
            Explore Moringa Projects
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Discover brilliant innovations built by Moringa School students.
            Dive into diverse tech stacks, meet creators, and submit your own work.
          </p>
          <div className="space-x-4">
            <Link
              to="/projects"
              className="bg-[#FFE602] text-gray-800 font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-300 transition"
            >
              Browse Projects
            </Link>
            <Link
              to="/submit"
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
            alt="Student Projects Graphic"
            className="w-full max-w-md md:max-w-full"
          />
        </motion.div>
      </div>

      {/* //featured projects */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#4F9CF9] mb-10">
            Featured Projects
          </h2>
          {featuredProjects.length === 0 ? (
            <p className="text-center text-gray-600">No featured projects available.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {featuredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  
                  <div className="p-4 flex flex-col justify-between h-full">
  <div>
    <h2 className="text-xl font-semibold text-[#043873]">{project.name}</h2>
    <p className="text-sm text-gray-700 mb-2">
      {project.description.slice(0, 50)}...
    </p>
  </div>

  <div className="flex justify-between items-center mt-4">
    <p className="text-sm text-gray-700">
      <strong>By</strong> {project.author}
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

      {/* Admin Note */}
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

export default Home;
