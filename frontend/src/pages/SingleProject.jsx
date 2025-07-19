import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function SingleProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then(setProject)
      .catch(err => console.error(err));
  }, [id]);

  if (!project) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p className="text-lg">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] to-[#f0f9ff] py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 transition hover:shadow-blue-200">
        <h1 className="text-3xl font-bold text-[#043873] mb-4">{project.name}</h1>
        <p className="text-gray-700 mb-6">{project.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-base">
          <div>
            <p><span className="font-semibold text-[#4F46E5]">Tech Stack:</span> {project.stack}</p>
            <p><span className="font-semibold text-[#4F46E5]">Created:</span> {project.created}</p>
            <p><span className="font-semibold text-[#4F46E5]">Cohort:</span> {project.cohort}</p>
            <p><span className="font-semibold text-[#4F46E5]">Author:</span> {project.author}</p>
          </div>
          <div>
            <p>
              <span className="font-semibold text-[#4F46E5]">GitHub:</span>{' '}
              <a href={project.github} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                {project.github}
              </a>
            </p>
            <p><span className="font-semibold text-[#4F46E5]">Team Members:</span> {project.members.join(', ')}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="bg-[#043873] text-white px-6 py-2 rounded-lg hover:bg-[#032f62] transition"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProject;