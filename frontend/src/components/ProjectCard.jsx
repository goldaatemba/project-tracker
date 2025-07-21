import { Link } from 'react-router-dom';

function ProjectCard({ project }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-xl">
  <h2 className="text-xl font-semibold text-[#043873]">{project.name}</h2>
  <p className="text-sm text-gray-700 mb-2">
    {project.description.slice(0, 100)}...
  </p>
  <p className="text-sm text-gray-600">
    <strong>Stack:</strong> {project.tech_stack}
  </p>
      <p className="text-sm mt-3 text-gray-700"><strong>Owner: </strong> {project.owner}</p>

  

  <div className="flex justify-between items-center mt-3">
    <p className="text-sm text-gray-500"><strong>Created on: </strong> {project.created_at}</p>
    <Link
        to={`/projects/${project.id}`}
        className="inline-block mt-3 text-sm text-white bg-[#043873] px-4 py-1 rounded hover:bg-[#032e5e]"
      >
        View Project
      </Link>
  </div>
</div>

  );
}

export default ProjectCard;