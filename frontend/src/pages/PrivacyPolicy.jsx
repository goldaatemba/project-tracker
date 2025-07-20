import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="max-w-2xl bg-white rounded-lg shadow-md p-8 text-center text-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy describes how we handle personal information collected through the Project Tracker App.
        </p>
        <p className="mb-4">
          We collect user details, project submissions, cohort affiliation, and tech stack usage to facilitate project management, tracking, and collaboration among students and instructors.
        </p>
        <p className="mb-4">
          Authentication data such as email and passwords are securely stored and encrypted. We do not store any sensitive information beyond what is necessary for functionality.
        </p>
        <p className="mb-4">
          Data is only accessible to authorized users and administrators and is never shared with third parties without your explicit consent.
        </p>
        <p>
          By using this app, you agree to the collection and use of information in accordance with this policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
