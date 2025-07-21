import React from 'react';

const ProjectForm = () => {
  return (
    <form className="bg-blue-100 p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-blue-900 font-medium mb-2">
            Project Name
            <input type="text" name="projectName" className="w-full p-2 border border-blue-300 rounded mt-1" />
          </label>
        </div>
        <div>
          <label className="block text-blue-900 font-medium mb-2">
            Description
            <input type="text" name="description" className="w-full p-2 border border-blue-300 rounded mt-1" />
          </label>
        </div>
        <div>
          <label className="block text-blue-900 font-medium mb-2">
            GitHub Link
            <input type="text" name="githubLink" className="w-full p-2 border border-blue-300 rounded mt-1" />
          </label>
        </div>
        <div>
          <label className="block text-blue-900 font-medium mb-2">
            Cohort Selection
            <input type="text" name="cohortSelection" className="w-full p-2 border border-blue-300 rounded mt-1" />
          </label>
        </div>
        <div>
          <label className="block text-blue-900 font-medium mb-2">
            Tech Stack
            <select name="techStack" className="w-full p-2 border border-blue-300 rounded mt-1">
              <option value="">Select a tech stack</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-blue-900 font-medium mb-2">
            Add Group Members (Optional)
            <input type="text" name="groupMembers" className="w-full p-2 border border-blue-300 rounded mt-1" />
          </label>
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800">
        Submit
      </button>
    </form>
  );
};

export default ProjectForm;
