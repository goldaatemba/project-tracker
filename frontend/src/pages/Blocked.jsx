import React from 'react';

const Blocked = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Account Blocked</h1>
      <p className="text-lg max-w-xl">
        Your account has been blocked by the administrator. If you believe this is a mistake, please contact support.
      </p>
    </section>
  );
};

export default Blocked;
