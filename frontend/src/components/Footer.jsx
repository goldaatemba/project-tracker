import React from "react";
import { Link } from "react-router-dom";


function Footer() {
  return (
    <footer className="bg-[#043873] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/*  Brand */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#FFE602] mb-2">
            Project Management System
          </h2>
          <p className="text-sm text-gray-300">
            Student Showcase Hub<br />
            Featuring innovations from Moringa School students.
          </p>
        </div>

        {/* Moringa School */}
        <div>
          <h3 className="text-md sm:text-lg text-[#FFE602] font-semibold mb-2">ProjectBank</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="/about" className="hover:underline">About Moringa</a></li>
            <li><a href="#" className="hover:underline">Courses</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Projects */}
        <div>
          <h3 className="text-md sm:text-lg text-[#FFE602] font-semibold mb-2">Projects</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <Link to="/addproject" className="hover:underline">
                Submit Project
              </Link>
              <li>
            <Link to="/projects" className="hover:underline">
                Browse Projects
              </Link>
              </li>           <li><a href="#" className="hover:underline">Guidelines</a></li>
            <li><a href="#" className="hover:underline">Resources</a></li>
          </ul>
        </div>

        {/*Connect */} 
        <div>
          <h3 className="text-md sm:text-lg text-[#FFE602] font-semibold mb-2">Connect</h3>
          <p className="text-sm text-gray-300">Let's collaborate and grow together.</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center border-t border-white/20 py-4 px-4">
        <p className="text-sm text-gray-300">
          Built by <span className="text-[#FFE602] font-medium">Moringa Students</span>
        </p>
        <p className="text-sm text-gray-300 mt-1">© 2025 ProjectBank. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
