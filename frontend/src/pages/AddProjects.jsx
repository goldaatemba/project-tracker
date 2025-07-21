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

    if (formData.projectName && formData.description) {
      toast.success('🚀 Project submitted successfully!');
      setFormData({
        projectName: '',
        description: '',
        githubLink: '',
        cohortSelection: '',
        techStack: '',
        groupMembers: '',
      });
    } else {
      toast.error('❗ Please fill in all required fields.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[#043873]">Submit Your Project</h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Share your creation with the Moringa community. Showcase your creativity, skills, and team effort!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Project Name', name: 'projectName', placeholder: 'e.g. Task Tracker App' },
            { label: 'Description', name: 'description', type: 'textarea', placeholder: 'What does your project do and why did you build it?' },
            { label: 'GitHub Link', name: 'githubLink', placeholder: 'https://github.com/your-repo' },
            { label: 'Cohort', name: 'cohortSelection', placeholder: 'e.g., SDF-Turbo 2025' },
            { label: 'Group Members', name: 'groupMembers', placeholder: 'Comma-separated names (optional)' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-[#043873] font-medium mb-1">
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  id={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  rows="4"
                  className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
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
            <label htmlFor="techStack" className="block text-[#043873] font-medium mb-1">
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

          <button
            type="submit"
            className="w-full bg-[#4F9CF9] text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
