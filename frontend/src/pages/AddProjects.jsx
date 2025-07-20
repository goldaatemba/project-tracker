import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    githubLink: '',
    cohortSelection: '',
    techStack: '',
    groupMembers: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated submission logic
    if (formData.projectName && formData.description) {
      toast.success('Project submitted successfully!');
      // Reset form (optional)
      setFormData({
        projectName: '',
        description: '',
        githubLink: '',
        cohortSelection: '',
        techStack: '',
        groupMembers: '',
      });
    } else {
      toast.error('Please fill in all required fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto my-10 space-y-8">
      <h2 className="text-3xl font-bold text-blue-900 text-center">Add a New Project</h2>

      <div className="space-y-6">
        {[
          { label: 'Project Name', name: 'projectName', placeholder: 'Enter your project\'s title' },
          { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Describe your project...' },
          { label: 'GitHub Link', name: 'githubLink', placeholder: 'https://github.com/your-repo' },
          { label: 'Cohort', name: 'cohortSelection', placeholder: 'e.g., SDF-Turbo 2025' },
          { label: 'Group Members', name: 'groupMembers', placeholder: 'Comma-separated names (optional)' },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label className="block text-blue-900 font-semibold mb-2" htmlFor={name}>
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                name={name}
                id={name}
                rows="4"
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full p-3 border border-blue-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            ) : (
              <input
                type="text"
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-blue-900 font-semibold mb-2" htmlFor="techStack">
            Tech Stack
          </label>
          <select
            name="techStack"
            id="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a tech stack</option>
            <option value="React/Flask">React / Flask</option>
            <option value="React/Django">React / Django</option>
            <option value="Android/Kotlin">Android / Kotlin</option>
            <option value="Node.js/Express">Node.js / Express</option>
            <option value="Vue/Firebase">Vue / Firebase</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-800 transition duration-200"
      >
        Submit Project
      </button>
    </form>
  );
};

export default ProjectForm;
