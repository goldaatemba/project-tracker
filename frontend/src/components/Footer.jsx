import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
<<<<<<< HEAD
    <footer className="bg-gray-100 rounded-lg shadow-sm dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Project-tracker
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-800 sm:mb-0 dark:text-gray-400">
            <li>
              <Link to="/about" className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/licensing" className="hover:underline me-4 md:me-6">
                Licensing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-800 sm:text-center dark:text-gray-400">
          © 2025 <a href="https://project-tracker.com/" className="hover:underline"><Project-tracker></Project-tracker></a>. All Rights Reserved.
        </span>
=======
    <footer className="bg-[#043873] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Brand */}
        <div>
          <h2 className="text-xl font-semibold text-[#FFE602] mb-2">
            Project Management System (Partnered with Moringa)
          </h2>
          <p className="text-sm text-gray-300">
            Student Showcase Hub<br />
            Showcasing the amazing projects and innovations from Moringa School students across all cohorts and tech stacks.
          </p>
        </div>

        {/* Section 2: Moringa School */}
        <div>
          <h3 className="text-lg text-[#FFE602] font-semibold mb-2">ProjectBank</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="/about" className="hover:underline">About Moringa</a></li>
            <li><a href="#" className="hover:underline">Courses</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Section 3: Projects */}
        <div>
          <h3 className="text-lg text-[#FFE602] font-semibold mb-2">Projects</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Submit Project</a></li>
            <li><a href="#" className="hover:underline">Browse Projects</a></li>
            <li><a href="#" className="hover:underline">Guidelines</a></li>
            <li><a href="#" className="hover:underline">Resources</a></li>
          </ul>
        </div>

        {/* Section 4: Connect */}
        <div>
          <h3 className="text-lg text-[#FFE602] font-semibold mb-2">Connect</h3>
          
          <p className="text-sm text-gray-300 mt-2">
            Built by <span className="text-[#FFE602] font-medium">Moringa Students</span>
          </p>
        </div>
>>>>>>> 1b55526cae0080c3029a1b6157556d0d8e62daa6
      </div>
      <div><p className="text-sm text-gray-300">© 2025 ProjectBank. All rights reserved.</p></div>
    </footer>
  );
};

export default Footer;
;