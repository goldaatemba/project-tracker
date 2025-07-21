import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profile_picture: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch('http://localhost:5000/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          username: data.username || '',
          bio: data.bio || '',
          profile_picture: data.profile_picture || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch('http://localhost:5000/users/me', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Update failed');
      }

      navigate('/profile'); // redirect to profile on success
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg space-y-6"
  >
    <h2 className="text-3xl font-semibold text-center">Edit Profile</h2>

    <div className="space-y-2">
      <label htmlFor="username" className="block text-sm font-medium">
        Username
      </label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div className="space-y-2">
      <label htmlFor="bio" className="block text-sm font-medium">
        Bio
      </label>
      <textarea
        id="bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="space-y-2">
      <label htmlFor="profile_picture" className="block text-sm font-medium">
        Profile Picture URL
      </label>
      <input
        type="text"
        id="profile_picture"
        name="profile_picture"
        value={formData.profile_picture}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      type="submit"
      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
    >
      Save Changes
    </button>
  </form>
</section>

  );
};

export default EditProfile;
