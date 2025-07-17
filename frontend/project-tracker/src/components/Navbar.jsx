import React, { useState } from "react";
import logo from "../assets/logo.png"
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-200 text-white">
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* <div className="w-8 h-8 rounded-full bg-blue-500"></div> */}
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            {/* <h1 className="text-xl font-bold">Logo</h1> */}
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="hover:underline">Home</a>
            <a href="/projects" className="hover:underline">Projects</a>
            <a href="/cohort" className="hover:underline">Cohorts</a>
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact us</a>
          </nav>
          <div className="hidden md:flex space-x-4">
            <button className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded">
              Sign in
            </button>
            <button className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded">
              Sign up
            </button>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="w-full flex flex-col space-y-2 mt-4 md:hidden">
            <a href="/" className="hover:underline">Home</a>
            <a href="/projects" className="hover:underline">Projects</a>
            <a href="/cohort" className="hover:underline">Cohorts</a>
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact us</a>
            <button className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded">
              Sign in
            </button>
            <button className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded">
              Sign up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
