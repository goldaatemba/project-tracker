import React from 'react';

const Licensing = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Licensing & Usage</h1>
        <p className="text-gray-700">
          The Project Tracker App is distributed under a <strong>custom educational use license</strong>. It is intended for use by students, instructors, and administrators for project tracking and collaboration within approved institutions.
        </p>
        <p className="mt-4 text-gray-700">
          Unauthorized distribution, commercial resale, or modification of this software outside the agreed license terms is strictly prohibited.
        </p>
        <p className="mt-4 text-gray-700">
          For more information or to request a commercial or institutional license, please contact the system administrator or visit our support page.
        </p>
      </div>
    </div>
  );
};

export default Licensing;
