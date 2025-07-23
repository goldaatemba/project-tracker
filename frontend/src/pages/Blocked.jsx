import React from 'react';
import { AlertTriangle } from 'lucide-react'; 

const Blocked = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-red-200 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500 h-12 w-12" />
        </div>
        <h1 className="text-3xl font-semibold text-red-600 mb-2">Account Blocked</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Your account has been blocked by the administrator. If you believe this is a mistake, please contact support for assistance.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
        >
          Return Home
        </button>
      </div>
    </section>
  );
};

export default Blocked;
