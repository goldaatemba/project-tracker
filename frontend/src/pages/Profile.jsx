import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Pencil } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error("No token found");
      return;
    }

    fetch('http://localhost:5000/me', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
  
    try {
      const res = await fetch('http://localhost:5000/logout', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        const err = await res.json();
        console.error("Logout failed:", err);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };

  const goToEditProfile = () => {
    navigate('/edit-profile');
  };

  if (!user) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <section className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white py-10">
      <div className="w-full max-w-5xl mx-auto flex flex-col">
        <div className="relative">
          <img
            src="/cover.jpg"
            alt="Cover"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          <div className="absolute -bottom-12 left-8 flex items-center gap-4">
            <img
              src="/default-avatar.png"
              alt="Avatar"
              className="rounded-lg w-28 h-28 border-4 border-white dark:border-gray-900 shadow-lg"
            />
            <div>
              <h1 className="text-3xl text-white font-bold">{user.username}</h1>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={goToEditProfile}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-10 px-4 md:px-0">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Account Info</h2>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</p>
              <p>{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</p>
              <p className={user.is_blocked ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                {user.is_blocked ? "Blocked" : "Active"}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">My Projects</h2>
            {user.owned_projects?.length > 0 ? (
              <ul className="space-y-3">
                {user.owned_projects.map(project => (
                  <li key={project.id} className="border p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No owned projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
