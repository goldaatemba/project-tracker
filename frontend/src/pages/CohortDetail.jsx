import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_url } from "../config.json";


const api_url = "https://project-bank-db99.onrender.com";

export default function CohortDetail() {
  const { id } = useParams(); 
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api_url}/cohorts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cohort");
        return res.json();
      })
      .then((data) => {
        setCohort(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading cohort details...</div>;
  if (!cohort) return <div>Cohort not found</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md p-6 rounded-lg mt-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">
        {cohort.name}
      </h2>
      <p className="text-blue-700 mb-2">
        Students: {cohort.members.length} | Projects: {cohort.projects.length}
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2 text-blue-800">Students</h3>
      <ul className="list-disc pl-6">
        {cohort.members.map((m) => (
          <li key={m.id}>{m.username} ({m.email})</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-2 text-blue-800">Projects</h3>
      <div className="space-y-4">
        {cohort.projects.map((p) => (
          <div key={p.id} className="bg-blue-100 p-4 rounded shadow">
            <h4 className="text-lg font-semibold">{p.title}</h4>
            <p>{p.description}</p>
            <p className="text-sm text-blue-700">By: {p.author_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
