import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const api_url = "http://localhost:5000";
const auth_token = localStorage.getItem("access_token");

export default function ManageCohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [cohortName, setCohortName] = useState("");
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${api_url}/cohorts`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch cohorts"))
      .then(setCohorts)
      .catch((err) => toast.error(err));
  }, []);

  useEffect(() => {
    fetch(`${api_url}/cohorts/unassigned`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to load unassigned users"))
      .then(setUnassignedUsers)
      .catch((err) => toast.error(err));
  }, []);

  const handleCreate = () => {
    if (!cohortName.trim()) return toast.warning("Cohort name is required");
  
    fetch(`${api_url}/cohorts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ name: cohortName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create cohort");
        return res.json(); 
      })
      .then((newCohort) => {
        setCohorts((prev) => [...prev, { ...newCohort, members: [] }]);
        setCohortName(""); 
        toast.success(`Cohort "${newCohort.name}" created`);
      })
      .catch((err) => toast.error(err.message));
  };
  

  const deleteCohort = (cohortId, cohortName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the cohort "${cohortName}"? All its members will become unassigned.`
      )
    )
      return;
  
    fetch(`${api_url}/cohorts/${cohortId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete cohort");
        toast.success(` Cohort "${cohortName}" deleted`);
  
        setCohorts((prev) => prev.filter((c) => c.id !== cohortId));
  
        const deletedCohort = cohorts.find((c) => c.id === cohortId);
        const deletedMembers = deletedCohort?.members || [];
  
        setUnassignedUsers((prev) => [...prev, ...deletedMembers]);
      })
      .catch((err) => toast.error(err.message || "Error deleting cohort"));
  };
  
  

  const assignUser = (userId, cohortId) => {
    fetch(`${api_url}/cohorts/assign_user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ user_id: userId, cohort_id: cohortId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to assign user");
        return res.json();
      })
      .then(() => {
        toast.success("User assigned!");
        const user = unassignedUsers.find((u) => u.id === userId);
        setUnassignedUsers((prev) => prev.filter((u) => u.id !== userId));
        setCohorts((prev) =>
          prev.map((c) =>
            c.id === parseInt(cohortId)
              ? { ...c, members: [...(c.members || []), user] }
              : c
          )
        );
      })
      .catch((err) => toast.error(err?.message || "Something went wrong"));
  };

  const unassignUser = (userId, cohortId) => {
    fetch(`${api_url}/cohorts/unassign_user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to unassign user");
        return res.json();
      })
      .then(() => {
        toast.success("User unassigned!", {
          toastId: `unassign-${userId}`,
          autoClose: 3000,
        });
  
        const cohort = cohorts.find((c) => c.id === cohortId);
        const user = cohort?.members.find((u) => u.id === userId);
  
        if (user) {
          setCohorts((prev) =>
            prev.map((c) =>
              c.id === cohortId
                ? { ...c, members: c.members.filter((u) => u.id !== userId) }
                : c
            )
          );
  
          setUnassignedUsers((prev) => [...prev, user]);
        }
      })
      .catch((err) =>
        toast.error(err?.message || "Error unassigning user", {
          toastId: `unassignError-${userId}`,
          autoClose: 3000,
        })
      );
  };
  

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
      onClick={() => navigate("/admin")}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
    >
       Return
    </button>
      <h1 className="text-2xl font-bold mb-4">Manage Cohorts</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Cohort Name"
          value={cohortName}
          onChange={(e) => setCohortName(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Unassigned Users</h2>
        {unassignedUsers.length === 0 ? (
          <p className="text-gray-600">No unassigned users.</p>
        ) : (
          <ul className="space-y-2">
            {unassignedUsers.map((user) => (
              <li key={user.id} className="flex items-center justify-between border p-2 rounded">
                <span>
                  {user.username} ({user.email})
                </span>
                <select
                  onChange={(e) => assignUser(user.id, e.target.value)}
                  defaultValue=""
                  className="border rounded px-3 py-1 ml-4 bg-white"
                >
                  <option value="" disabled>Assign to cohort...</option>
                  {cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Cohorts</h2>
        {cohorts.map((cohort) => (
          <div key={cohort.id} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-blue-700">{cohort.name}</h3>
            <button onClick={() => deleteCohort(cohort.id, cohort.name)}
                className="ml-4 text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                Delete
            </button>

          </div>
          <ul className="space-y-2 mt-2">
            {(cohort.members || []).map((member) => (
              <li key={member.id} className="flex items-center justify-between">
                <span>
                  {member.username} ({member.email})
                </span>
                <button
                  onClick={() => unassignUser(member.id, cohort.id)}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                >
                  Unassign
                </button>
              </li>
            ))}
          </ul>
        </div>
        ))}
      </div>
    </div>
  );
}
