import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center p-8 min-h-screen">
      <div className="w-full flex flex-col md:flex-row items-center max-w-7xl mx-auto">
        {/* Left section with text */}
        <div className="md:w-1/2 text-center md:text-left px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-800 mb-4">
            Welcome to Project Tracker
          </h1>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            Track Progress. Collaborate. Succeed.
          </h3>
          <p className="mt-4 text-lg md:text-xl text-gray-600 leading-relaxed">
            Manage student projects, collaborate with team members, and stay up to date with real-time progress insights.
          </p>
        </div>

        {/* Right section with image */}
        <div className="md:w-1/2 mt-10 md:mt-0 px-4">
          <img src="/images/project-tracker.png" alt="Project Tracker Illustration" className="w-full h-auto rounded-xl shadow-xl object-cover" />

        </div>
      </div>
    </div>
  );
};

export default Home;
