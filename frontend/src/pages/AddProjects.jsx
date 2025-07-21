import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    githubLink: '',
    cohortSelection: '',
    techStack: [],
    groupMembers: '',
  });

  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/cohorts')
      .then((res) => res.json())
      .then((data) => setCohorts(data))
      .catch(() => toast.error('⚠️ Failed to load cohorts.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechStackChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, techStack: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { projectName, description, githubLink, cohortSelection, techStack, groupMembers } = formData;

    if (!projectName || !description || !cohortSelection) {
      toast.error('Please fill in required fields.');
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
        body: JSON.stringify({
          ...formData,
          techStack: formData.techStack.join(', '), 
        }),
      });

      if (!res.ok) throw new Error('Failed to submit project');
      toast.success(' Project submitted!');

      setFormData({
        projectName: '',
        description: '',
        githubLink: '',
        cohortSelection: '',
        techStack: [],
        groupMembers: '',
      });
    } catch (err) {
      toast.error('Something went wrong!');
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
            placeholder="e.g., JobTracker"
            value={formData.projectName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description *</label>
          <textarea
            name="description"
            placeholder="Briefly describe your project..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">GitHub Link</label>
          <input
            type="url"
            name="githubLink"
            placeholder="https://github.com/your-project"
            value={formData.githubLink}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cohort *</label>
          <select
            name="cohortSelection"
            value={formData.cohortSelection}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="block mb-1 font-medium">Tech Stack</label>
          <select
            name="techStack"
            multiple
            value={formData.techStack}
            onChange={handleTechStackChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 h-48"
          >
            <option value="React">React</option>
            <option value="Flask">Flask</option>
            <option value="Django">Django</option>
            <option value="Node.js">Node.js</option>
            <option value="Express">Express</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MongoDB">MongoDB</option>
            <option value="Tailwind CSS">Tailwind CSS</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Group Members</label>
          <input
            type="text"
            name="groupMembers"
            placeholder="e.g., Alex, Fatma, Kevin"
            value={formData.groupMembers}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg transition duration-200"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
