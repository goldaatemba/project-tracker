import React from "react";

export default function CohortProjects() {
  return (
    <div className="bg-blue-100 p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        Projects are grouped by Moringa cohorts. Select a cohort to explore projects built by that class.
      </h2>
      <div className="flex justify-center mb-6">
        <div className="relative">
          <input type="text" placeholder="Search Cohort" className="p-2 pl-4 border border-blue-300 rounded-full" />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <span>🔍</span>
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-blue-900">SDFT13-2025</h3>
          <p className="text-blue-700">Students: 35</p>
          <p className="text-blue-700">Total Projects: 12</p>
        </div>
        <button className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800">
          View Projects
        </button>
      </div>
    </div>
  );
}
