import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
const api_url = import.meta.env.VITE_API_URL;


const TechContext = createContext();

export const TechProvider = ({ children }) => {
  const [techs, setTechs] = useState([]);

  function fetch_techs() {
    fetch(`${api_url}/techs`)
      .then(res => res.json())
      .then(data => setTechs(data))
      .catch(() => toast.error("Failed to load techs"));
  }

  function create_tech(name, token) {
    toast.loading("Creating tech...");
    fetch(`${api_url}/techs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) toast.error(data.error);
        else {
          toast.success("Tech created successfully");
          fetch_techs();
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Network error while creating tech");
      });
  }

  function update_tech(id, name, token) {
    toast.loading("Updating tech...");
    fetch(`${api_url}/techs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        toast.dismiss();
        toast.success("Tech updated");
        fetch_techs();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to update tech");
      });
  }

  function delete_tech(id, token) {
    toast.loading("Deleting tech...");
    fetch(`${api_url}/techs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.dismiss();
        toast.success("Tech deleted");
        fetch_techs();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to delete tech");
      });
  }

  useEffect(() => {
    fetch_techs();
  }, []);

  return (
    <TechContext.Provider value={{ techs, create_tech, update_tech, delete_tech }}>
      {children}
    </TechContext.Provider>
  );
};

export const useTech = () => useContext(TechContext);
