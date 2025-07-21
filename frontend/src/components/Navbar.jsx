<<<<<<< HEAD
// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="container flex flex-wrap items-center justify-between mx-auto px-4 py-8">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Project Access Control
          </span>
        </Link>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-sky-700 rounded-sm md:bg-transparent md:text-sky-700 md:p-0 dark:text-white md:dark:text-sky-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/access"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-sky-500"
              >
                Project
              </Link>
            </li>

            {currentUser ? (
              <>
                {!currentUser.is_admin && (
                  <li>
                    <Link
                      to="/addproject"
                      className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-sky-500"
                    >
                      Add Project
                    </Link>
                  </li>
                )}
                {currentUser.is_admin && (
                  <li>
                    <Link
                      to="/users"
                      className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-sky-500"
                    >
                      Users
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-sky-500"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="block p-2 bg-slate-600 text-white rounded-full"
                  >
                    {currentUser.username}
                  </button>
                </li>
                <li>
                  <button
                    onClick={logout_user}
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-sky-500"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-sky-500"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-sky-500"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
=======
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("No token found.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        const data = await res.json();
        console.error("Logout failed:", data);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const linkClass = "text-white hover:text-yellow-400 px-4 py-2 font-medium";

  const studentLinks = [
    { name: "Projects", path: "/projects" },
    { name: "Cohorts", path: "/cohorts" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`bg-[#043873] shadow-md sticky top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          ProjectBank
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {studentLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className="bg-yellow-400 text-[#043873] px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold"
            >
              Login
            </NavLink>
          ) : (
            <>
              <NavLink to="/profile" className="text-white">
                <User size={24} />
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-[#043873]">
          {studentLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-yellow-400 py-2 border-b border-white"
            >
              {link.name}
            </NavLink>
          ))}
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-[#043873] bg-yellow-400 rounded-lg px-4 py-2 text-center font-semibold"
            >
              Login
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-white text-center"
              >
                <User size={24} className="mx-auto" />
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-white text-center bg-red-500 rounded-lg px-4 py-2 font-semibold hover:bg-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
>>>>>>> 1b55526cae0080c3029a1b6157556d0d8e62daa6
    </nav>
  );
};

export default Navbar;
