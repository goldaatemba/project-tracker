import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { UserContext } from '../context/UserContext';

const Projects = () => {
  const { currentUser } = useContext(UserContext);
  const { projects, handleLike, approveProject } = useContext(ProjectContext);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects ({projects && projects.length})</h2>
      {projects && projects.length < 1 ? (
        <p>No projects at the moment</p>
      ) : (
        <ul>
          {/* Admin View: See all projects */}
          {currentUser && currentUser.is_admin && projects.map((project) => (
            <li key={project.id} className="flex items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              {/* Likes (optional) */}
              <div className="flex flex-col items-center justify-center mr-4 min-w-20">
                <button
                  onClick={() => handleLike(project.id, 1)}
                  className="hover:text-gray-700 py-1 px-2 rounded-full mt-2"
                >
                  <IoMdArrowDropupCircle size={40} />
                </button>
                <span className="text-lg font-bold">{project.likes}</span>
                <button
                  onClick={() => handleLike(project.id, -1)}
                  className="hover:text-gray-700 py-1 px-2 rounded-full mt-2"
                >
                  <IoMdArrowDropdownCircle size={40} />
                </button>
              </div>

              {/* Project Info */}
              <div>
                <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                </Link>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-sm text-gray-500">Tech: {project.tech_stack} | Cohort: {project.cohort?.name}</p>

                <div className="flex gap-4 mt-2">
                  {project.is_approved ? (
                    <button onClick={() => approveProject(project.id, false)} className="bg-red-600 px-2 py-1 text-white">
                      Disapprove
                    </button>
                  ) : (
                    <button onClick={() => approveProject(project.id, true)} className="bg-green-600 px-2 py-1 text-white">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}

          {/* Normal User View: Only approved projects */}
          {currentUser && !currentUser.is_admin && projects.filter(p => p.is_approved).map((project) => (
            <li key={project.id} className="flex items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="flex flex-col items-center justify-center mr-4 min-w-20">
                <button
                  onClick={() => handleLike(project.id, 1)}
                  className="hover:text-gray-700 py-1 px-2 rounded-full mt-2"
                >
                  <IoMdArrowDropupCircle size={40} />
                </button>
                <span className="text-lg font-bold">{project.likes}</span>
                <button
                  onClick={() => handleLike(project.id, -1)}
                  className="hover:text-gray-700 py-1 px-2 rounded-full mt-2"
                >
                  <IoMdArrowDropdownCircle size={40} />
                </button>
              </div>

              <div>
                <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                </Link>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-sm text-gray-500">Tech: {project.tech_stack} | Cohort: {project.cohort?.name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Projects;
