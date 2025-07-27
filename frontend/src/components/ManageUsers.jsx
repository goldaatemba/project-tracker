import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
const API_URL = import.meta.env.VITE_API_URL;
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch(
<<<<<<< HEAD
        `http://localhost:5000/users${showUnassigned ? "?unassigned=true" : ""}`,
=======
        `${API_URL}/users${showUnassigned ? "?unassigned=true" : ""}`,
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Error fetching users");
      console.error(error);
    }
  };

  const toggleBlock = async (user) => {
    try {
<<<<<<< HEAD
      const res = await fetch("http://localhost:5000/update_user", {
=======
      const res = await fetch(`${API_URL}/update_user`, {
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          is_blocked: !user.is_blocked,
        }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updated = await res.json();
      toast.success(`User ${updated.username} ${updated.is_blocked ? "banned" : "unbanned"}`);
      fetchUsers();
    } catch (error) {
      toast.error("Error updating user");
      console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
<<<<<<< HEAD
      const res = await fetch(`http://localhost:5000/delete_user_profile/${userId}`, {
=======
      const res = await fetch(`${API_URL}/delete_user_profile/${userId}`, {
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error deleting user");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [showUnassigned]);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <button
      onClick={() => navigate("/admin")}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
    >
      Return
    </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Manage Users</h2>

        <div className="flex items-center mb-6">
          <input
            id="unassigned"
            type="checkbox"
            className="mr-2 accent-blue-500"
            checked={showUnassigned}
            onChange={() => setShowUnassigned(!showUnassigned)}
          />
          <label htmlFor="unassigned" className="text-sm text-gray-700">
            Show only unassigned users
          </label>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="border px-4 py-3">Username</th>
                <th className="border px-4 py-3">Email</th>
                <th className="border px-4 py-3 text-center">Admin</th>
                <th className="border px-4 py-3 text-center">Blocked</th>
                <th className="border px-4 py-3 text-center">Cohort</th>
                <th className="border px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50 transition">
                    <td className="border px-4 py-2">{user.username}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2 text-center">
                      {user.is_admin ? "✅" : "❌"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {user.is_blocked ? "🚫" : "✅"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {user.cohort_id || "None"}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => toggleBlock(user)}
                        className={`px-3 py-1 rounded text-sm font-medium text-white transition ${
                          user.is_blocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {user.is_blocked ? "Unban" : "Ban"}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 rounded text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
