import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

const CohortContext = createContext();

export const CohortProvider = ({ children }) => {
  const [cohorts, setCohorts] = useState([]);

  function fetch_cohorts() {
    fetch(`${api_url}/cohorts`)
      .then(res => res.json())
      .then(data => setCohorts(data))
      .catch(() => toast.error("Failed to load cohorts"));
  }

  function create_cohort(name, token) {
    toast.loading("Creating cohort...");
    fetch(`${api_url}/cohorts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        toast.dismiss();
        toast.success("Cohort created");
        fetch_cohorts();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to create cohort");
      });
  }

  function update_cohort(id, name, token) {
    toast.loading("Updating cohort...");
    fetch(`${api_url}/cohorts${id}`, {
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
  }

  function delete_cohort(id, token) {
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
  }

  useEffect(() => {
    fetch_cohorts();
  }, []);

  return (
    <CohortContext.Provider value={{ cohorts, create_cohort, update_cohort, delete_cohort }}>
      {children}
    </CohortContext.Provider>
  );
};

export const useCohort = () => useContext(CohortContext);
