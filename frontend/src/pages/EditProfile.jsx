import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api_url } from "../config.json";


const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please login first");
      navigate('/login');
      return;
    }

    fetch('https://project-bank-db99.onrender.com/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then(data => {
        setFormData(prev => ({
          ...prev,
          username: data.username || '',
          email: data.email || ''
        }));
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    
    if (formData.newPassword && !formData.password) {
      toast.error("Current password is required to change password");
      return;
    }

    setIsSubmitting(true);
  
    try {
      const updateData = {
        ...(formData.username && { username: formData.username }),
        ...(formData.email && { email: formData.email }),
        ...(formData.password && { password: formData.password }),
        ...(formData.newPassword && { newPassword: formData.newPassword }),
      };

      const res = await fetch('https://project-bank-db99.onrender.com/update_user', {
        method: 'PATCH', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");
  
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white px-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-3xl font-semibold text-center">Edit Profile</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Username</label>
          <input 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Current Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Required for password changes"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">New Password</label>
          <input 
            type="password" 
            name="newPassword" 
            value={formData.newPassword} 
            onChange={handleChange} 
            placeholder="Leave blank to keep current"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-2 px-4 ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold rounded-lg transition-colors`}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
};

export default EditProfile;