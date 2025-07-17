import React from "react";

export default function Projects() {
  return (
    <div className="bg-blue-100 p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        Browse and explore projects created by Moringa School students. Use filters to narrow by stack android or tech stack.
      </h2>
      <div className="flex justify-center mb-6">
        <select className="p-2 border border-blue-300 rounded">
          <option value="">Project Type</option>
        </select>
      </div>
      <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-blue-900">Project Tracker</h3>
          <p className="text-blue-700">Track, share and explore students projects created at: 21/07/2025</p>
        </div>
        <button className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800">
          View more
        </button>
      </div>
    </div>
  );
}
