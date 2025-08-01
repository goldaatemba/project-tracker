import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = import.meta.env.VITE_API_URL;


function AddProjects() {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    githubLink: '',
    cohortId: '',
    techStack: '',
    groupMembers: '',
  });

  const [cohorts, setCohorts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/me`, {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate('/login');
          }
          throw new Error('Failed to fetch user');
        }
        return res.json();
      })
      .then((userData) => {
        if (userData.is_blocked) {
          navigate('/blocked');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to verify user.');
      });

    fetch(`${API_URL}/cohorts`, {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate('/login');
          }
          throw new Error('Unauthorized or failed to fetch');
        }
        return res.json();
      })
      .then((data) => setCohorts(data))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load cohorts.');
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { projectName, description, githubLink, cohortId, techStack, groupMembers } = formData;

    if (!projectName || !description || !cohortId || !techStack) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      name: projectName,
      description,
      github_link: githubLink,
      cohort_id: parseInt(cohortId),
      tech: techStack,
      group_members: groupMembers,
    };

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit project');
      }

      toast.success('Project submitted!');
      setFormData({
        projectName: '',
        description: '',
        githubLink: '',
        cohortId: '',
        techStack: '',
        groupMembers: '',
      });
      navigate('/projects');
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Submit a Project</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Project Name *</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
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
            name="cohortId"
            value={formData.cohortId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">-- Select Cohort --</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
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
{/*         <div>
          <label className="block mb-1 font-medium">Group Members</label>
          <input
            type="text"
            name="groupMembers"
            value={formData.groupMembers}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., Alice, Bob, Carlos"
          />
        </div> */}
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

export default AddProjects;
