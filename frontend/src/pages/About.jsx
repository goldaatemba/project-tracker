import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">About the Project Tracker App</h1>
        
        <p className="text-gray-700 text-lg">
          The Project Tracker App is a robust tool designed to help students and administrators at Moringa School efficiently manage and monitor student projects.
          It provides a centralized platform for tracking project progress, tech stacks, cohorts, and team collaborations.
        </p>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Key Features</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Student and Admin authentication with JWT</li>
            <li>Create, edit, view, and delete projects</li>
            <li>Assign tech stacks and cohorts to projects</li>
            <li>Manage group members and their roles</li>
            <li>Filter projects by cohort or tech stack</li>
            <li>Secure, scalable backend with Flask and PostgreSQL</li>
            <li>Modern frontend built with React and Tailwind CSS</li>
          </ul>
        </div>

        <div className="space-y-4 text-blue-800 text-base leading-relaxed">
          <p><strong>Discover:</strong> Explore a diverse range of student projects from different cohorts and disciplines. Filter by category, cohort, or technology used.</p>
          <p><strong>Upload:</strong> Easily upload your own project to the platform and showcase your skills, ideas, and progress. Perfect for portfolio building and peer feedback.</p>
          <p><strong>Collaborate:</strong> Find other students working on similar ideas and connect for possible collaboration or peer review.</p>
          <p><strong>Track Progress:</strong> Admins and students can follow how projects evolve over time, ensuring continuity and accountability.</p>
          <p><strong>Highlight Excellence:</strong> Exceptional projects can be featured, helping to motivate and recognize great work within the community.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to streamline project management for students and administrators by offering a clear, organized,
            and secure environment to collaborate and monitor academic progress. We aim to enhance visibility, accountability,
            and performance through real-time data access and intuitive interfaces.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Technologies Used</h2>
          <p className="text-gray-700">
            This app is built using <strong>React.js</strong> and <strong>Tailwind CSS</strong> for the frontend,
            <strong> Flask</strong> for the backend API, <strong>PostgreSQL</strong> as the database, and 
            <strong> JSON Web Tokens (JWT)</strong> for secure user authentication and session handling.
          </p>
        </div>

        <footer className="pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Project Tracker App — Developed by Group 5 at Moringa School
        </footer>
      </div>
    </div>
  );
};

export default About;
