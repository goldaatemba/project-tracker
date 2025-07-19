import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/me', {
      method: "GET",
      credentials: "include", // This is crucial when using cookies
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);
  

  if (!user) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <section className="w-full overflow-hidden dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="flex flex-col">
        { /* Cover image */ }
        <img src="/cover.jpg" alt="Cover" className="w-full h-64 object-cover" />

        <div className="w-11/12 mx-auto -mt-20 flex items-center gap-4">
          <img
            src="/default-avatar.png"
            alt="Avatar"
            className="rounded-md w-28 h-28 outline outline-2 outline-offset-2 outline-blue-500"
          />
          <h1 className="text-3xl font-semibold">{user.username}</h1>
        </div>

        <div className="w-11/12 mx-auto mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-1">Email</h2>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>

            <h2 className="text-lg font-medium mt-4 mb-1">Joined</h2>
            <p className="text-gray-600 dark:text-gray-300">{new Date(user.created_at).toLocaleDateString()}</p>

            <h2 className="text-lg font-medium mt-4 mb-1">Account Status</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {user.is_blocked ? "Blocked" : "Active"}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">My Projects</h2>
            {user.owned_projects?.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {user.owned_projects.map(project => (
                  <li key={project.id}>
                    <span className="font-medium">{project.title}</span>: {project.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No owned projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
