import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { ProjectContext } from '../context/ProjectContext';
import { toast } from 'react-toastify';

const AddProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [cohort, setCohort] = useState('');

  const { add_project } = useContext(ProjectContext);
  const { currentUser } = useContext(UserContext);

  if (!currentUser || currentUser.is_admin) {
    return <div className="text-center mt-20">Please log in as a student to add a project.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.length < 5) {
      toast.error('Project title must be at least 5 characters long.');
      return;
    }

    if (description.length < 20) {
      toast.error('Project description must be at least 20 characters.');
      return;
    }

    if (!techStack || !cohort) {
      toast.error('Tech stack and cohort are required.');
      return;
    }

    // Submit project
    add_project({
      title,
      description,
      tech_stack: techStack,
      cohort,
      student_id: currentUser.id
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTechStack('');
    setCohort('');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Submit a New Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-600 font-medium">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
            placeholder="Project title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-600 font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
            placeholder="Brief description of the project"
            rows="5"
            required
          />
        </div>

        <div>
          <label htmlFor="techStack" className="block text-gray-600 font-medium">Tech Stack</label>
          <input
            type="text"
            id="techStack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
            placeholder="e.g., React, Flask, PostgreSQL"
            required
          />
        </div>

        <div>
          <label htmlFor="cohort" className="block text-gray-600 font-medium">Cohort</label>
          <input
            type="text"
            id="cohort"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
            placeholder="e.g., Phase 5, Web-PT-11"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-3 rounded-md hover:bg-sky-600 transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
