import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center p-8 min-h-screen">
      <div className="w-full flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-6xl font-bold text-blue-800 mb-4">
            Welcome to Project Tracker
          </h1>
          <h3 className="text-3xl font-semibold text-gray-700 mb-2">
            Track Progress. Collaborate. Succeed.
          </h3>
          <p className="mt-4 text-xl text-gray-600">
            Manage student projects, collaborate with team members, and stay up to date with real-time progress insights.
          </p>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img 
            src="./images/project-tracker.png" 
            alt="Project Tracker Illustration" 
            className="w-full h-auto rounded-lg shadow-lg" 
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
