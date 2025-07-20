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
    </nav>
  );
};

export default Navbar;