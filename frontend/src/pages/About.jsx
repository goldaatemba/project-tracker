import React from "react";

export default function About() {
  return (
    <div className="bg-blue-100 p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
        Track, Share, and Explore Student Projects
      </h2>
      <p className="text-lg text-blue-800 leading-relaxed text-center mb-6">
        Project Tracker is your central hub to upload, browse, and revisit all student projects
        across cohorts. Whether you're looking to get inspired, collaborate, or showcase your work — we've got you covered.
      </p>

      <div className="space-y-4 text-blue-800 text-base leading-relaxed">
        <p>
          🔍 <strong>Discover:</strong> Explore a diverse range of student projects from different cohorts and disciplines. Filter by category, cohort, or technology used.
        </p>
        <p>
          🚀 <strong>Upload:</strong> Easily upload your own project to the platform and showcase your skills, ideas, and progress. Perfect for portfolio building and peer feedback.
        </p>
        <p>
          🤝 <strong>Collaborate:</strong> Find other students working on similar ideas and connect for possible collaboration or peer review.
        </p>
        <p>
          📈 <strong>Track Progress:</strong> Admins and students can follow how projects evolve over time, ensuring continuity and accountability.
        </p>
        <p>
          🏆 <strong>Highlight Excellence:</strong> Exceptional projects can be featured, helping to motivate and recognize great work within the community.
        </p>
      </div>
    </div>
  );
}
