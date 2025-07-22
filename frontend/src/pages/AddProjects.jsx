import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    githubLink: '',
    cohortSelection: '',
    techStack: '',
    groupMembers: '',
  });

  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/cohorts')
      .then((res) => res.json())
      .then((data) => setCohorts(data))
      .catch(() => toast.error(' Failed to load cohorts.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { projectName, description, githubLink, cohortSelection, techStack } = formData;

    if (!projectName || !description || !cohortSelection || !techStack) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const cohortIsValid = cohorts.some((c) => c.name === cohortSelection);
    if (!cohortIsValid) {
      toast.error('Selected cohort does not exist.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit project');
      toast.success(' Project submitted!');

      setFormData({
        projectName: '',
        description: '',
        githubLink: '',
        cohortSelection: '',
        techStack: '',
        groupMembers: '',
      });
    } catch (err) {
      toast.error(' Something went wrong!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-semibold text-center mb-6">🚀 Submit a Project</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Project Name *</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., My Awesome App"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Describe the project..."
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">GitHub Link</label>
          <input
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://github.com/your-project"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cohort *</label>
          <select
            name="cohortSelection"
            value={formData.cohortSelection}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">-- Select Cohort --</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.name}>
                {cohort.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Tech Stack *</label>
          <select
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">-- Select Tech Stack --</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
            <option value="Web">Web</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Data Science">Data Science</option>
            <option value="Game Development">Game Development</option>
            <option value="IoT">IoT</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Group Members</label>
          <input
            type="text"
            name="groupMembers"
            value={formData.groupMembers}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., Alice, Bob, Carlos"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
