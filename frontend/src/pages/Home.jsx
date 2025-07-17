import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "/hero-graphic.png"; // Replace with your actual image
import featuredImg from "/heroImg.jpg"; // Replace or duplicate for others

function Home() {
  return (
    <section className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#4F9CF9] leading-tight">
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

      {/* Featured Projects */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#4F9CF9] mb-10">
            Featured Projects
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#4F9CF9]">
                    Project Title {i}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    A short summary of what this project does and the tech stack used.
                  </p>
                  <Link
                    to={`/projects/${i}`}
                    className="inline-block mt-4 text-sm text-[#4F9CF9] hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Note (optional) */}
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
