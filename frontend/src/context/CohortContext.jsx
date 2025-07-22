import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

const CohortContext = createContext();
const api_url = import.meta.env.VITE_API_URL;

export const CohortProvider = ({ children }) => {
  const [cohorts, setCohorts] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);

  const fetch_cohorts = () => {
    fetch(`${api_url}/cohorts`)
      .then(res => res.json())
      .then(setCohorts)
      .catch(() => toast.error("Failed to load cohorts"));
  };

  const fetch_unassigned_users = (token) => {
    fetch(`${api_url}/cohorts/unassigned`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setUnassignedUsers)
      .catch(() => toast.error("Failed to load unassigned users"));
  };

  const create_cohort = (name, token) => {
    toast.loading("Creating cohort...");
    fetch(`${api_url}/cohorts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(async (res) => {
        toast.dismiss();
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create cohort");
        }
        toast.success("Cohort created");
        fetch_cohorts();
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.message);
      });
  };

  const update_cohort = (id, name, token) => {
    toast.loading("Updating cohort...");
    fetch(`${api_url}/cohorts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        toast.dismiss();
        toast.success("Cohort updated");
        fetch_cohorts();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to update cohort");
      });
  };

  const delete_cohort = (id, token) => {
    toast.loading("Deleting cohort...");
    fetch(`${api_url}/cohorts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.dismiss();
        toast.success("Cohort deleted");
        fetch_cohorts();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to delete cohort");
      });
  };

  const add_user_to_cohort = (cohort_id, user_id, token) => {
    toast.loading("Adding user to cohort...");
    fetch(`${api_url}/cohorts/${cohort_id}/add_user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id }),
    })
      .then(async (res) => {
        toast.dismiss();
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to add user");
        }
        toast.success("User added to cohort");
        fetch_cohorts();
        fetch_unassigned_users(token);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.message);
      });
  };

  const remove_user_from_cohort = (user_id, token) => {
    toast.loading("Removing user from cohort...");
    fetch(`${api_url}/cohorts/remove_user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id }),
    })
      .then(async (res) => {
        toast.dismiss();
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to remove user");
        }
        toast.success("User removed from cohort");
        fetch_cohorts();
        fetch_unassigned_users(token);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetch_cohorts();
  }, []);

  return (
    <CohortContext.Provider
      value={{
        cohorts,
        unassignedUsers,
        fetch_cohorts,
        fetch_unassigned_users,
        create_cohort,
        update_cohort,
        delete_cohort,
        add_user_to_cohort,
        remove_user_from_cohort,
      }}
    >
      {children}
    </CohortContext.Provider>
  );
};

export const useCohort = () => useContext(CohortContext);
