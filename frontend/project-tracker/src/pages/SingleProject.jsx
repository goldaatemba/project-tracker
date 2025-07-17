import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import { api_url } from "../config.json";

const SingleProject = () => {
  const { project_id } = useParams();
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [project, setProject] = useState({});
  const { addCommentToProject } = useContext(ProjectContext);

  useEffect(() => {
    fetch(`${api_url}/projects/${project_id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        console.log("Project data", data);
      });
  }, [project_id, refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addCommentToProject(project_id, comment);
    setRefresh(!refresh);
    setComment('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h2>
      <p className="text-gray-600 mb-6">{project.description}</p>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Project Updates</h3>
        {project.comments && project.comments.length > 0 ? (
          <ul>
            {project.comments.map((c) => (
              <li key={c.id} className="bg-gray-100 p-3 mb-3 rounded">
                <p className="mb-2">{c.body}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{c.user?.username}</span>
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-600">No updates yet for this project.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 bg-white p-4 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="comment" className="block text-gray-700 font-medium">
            Add a Comment/Update
          </label>
          <textarea
            required
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-500"
            rows="4"
            placeholder="Share an update or feedback..."
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
          >
            Submit Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default SingleProject;
