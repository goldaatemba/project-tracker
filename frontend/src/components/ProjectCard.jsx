import { Link } from 'react-router-dom';

function ProjectCard({ project }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-xl transition hover:shadow-lg">
      <h2 className="text-xl font-semibold text-[#043873] mb-1">{project.name}</h2>
      
      <p className="text-sm text-gray-700 mb-2">
        {project.description?.slice(0, 100)}{project.description?.length > 100 ? '...' : ''}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        <strong>Stack:</strong> {project.stack || 'Unknown'}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        <strong>Cohort:</strong> {project.cohort?.name || 'N/A'}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        <strong>Owner:</strong> {project.owner || 'Unknown'}
      </p>

      <p className="text-sm text-gray-600 mb-3">
        <strong>Members:</strong> {project.members?.join(', ') || 'None'}
      </p>

      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-gray-500">
          <strong>Created on:</strong> {project.created_at || 'Unknown'}
        </p>

        <Link
          to={`/projects/${project.id}`}
          className="text-sm text-white bg-[#043873] px-4 py-1 rounded hover:bg-[#032e5e] transition"
        >
          View Project
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
