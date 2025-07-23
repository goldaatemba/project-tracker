import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Pencil } from 'lucide-react';
import { api_url } from "../config.json";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [ownedProjects, setOwnedProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://project-bank-db99.onrender.com/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(userData => {
        if (userData.is_blocked) {
          navigate('/blocked');
        } else {
          setUser(userData);
        }
      })
      .catch(() => navigate('/login'));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token || !user) return;

    fetch('https://project-bank-db99.onrender.com/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(projectData => {
        setProjects(projectData);
        const filtered = projectData.filter(p => p.owner_id === user.id);
        setOwnedProjects(filtered);
      })
      .catch(err => console.error("Error fetching projects:", err));
  }, [user]);

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await fetch('https://project-bank-db99.onrender.com/logout', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cohort</p>
              <p>{user.cohort ? user.cohort.name : 'Not assigned'}</p>
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
            {ownedProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ownedProjects.map(project => (
                  <div
                    key={project.id}
                    className="flex flex-col justify-between h-full bg-gray-100 dark:bg-gray-700 p-5 rounded-xl shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                        {project.description || "No description provided."}
                      </p>
                      {project.stack && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                          Stack: {project.stack}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="mt-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                    >
                      View Project
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">You don’t own any projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
