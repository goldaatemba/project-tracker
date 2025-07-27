import React, { useState, useEffect } from "react";

<<<<<<< HEAD
const api_url = "http://localhost:5000";
=======

const api_url = import.meta.env.VITE_API_URL;
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef

export default function CohortProjects() {
  const [cohorts, setCohorts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${api_url}/cohorts`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cohorts");
        return res.json();
      })
      .then((data) => setCohorts(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredCohorts = cohorts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-blue-100 p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        Projects are grouped by Moringa cohorts. Select a cohort to explore projects built by that class.
      </h2>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Cohort"
            className="p-2 pl-4 border border-blue-300 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <span role="img" aria-label="search">🔍</span>
          </button>
        </div>
      </div>

      {filteredCohorts.map((cohort) => (
        <div
          key={cohort.id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center mb-4"
        >
          <div>
            <h3 className="text-xl font-semibold text-blue-900">{cohort.name}</h3>
            <p className="text-blue-700">Students: {cohort.student_count}</p>
            <p className="text-blue-700">Total Projects: {cohort.project_count}</p>
          </div>
          <button
            className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800"
            onClick={() => window.location.href = `/projects?cohort_id=${cohort.id}`}
          >
            View Projects
          </button>
        </div>
      ))}
    </div>
  );
}
