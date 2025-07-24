import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
const api_url = import.meta.env.VITE_API_URL;

const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState([]);

  function fetch_members() {
    fetch(`${api_url}/members`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(() => toast.error("Failed to load members"));
  }

  function add_member(project_id, user_id, token) {
    toast.loading("Adding member...");
    fetch(`${api_url}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ project_id, user_id }),
    })
      .then(() => {
        toast.dismiss();
        toast.success("Member added");
        fetch_members();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to add member");
      });
  }

  function update_member(id, updates, token) {
    toast.loading("Updating member...");
    fetch(`${api_url}/members/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
      .then(() => {
        toast.dismiss();
        toast.success("Member updated");
        fetch_members();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to update member");
      });
  }

  function delete_member(id, token) {
    toast.loading("Removing member...");
    fetch(`${api_url}/members/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.dismiss();
        toast.success("Member removed");
        fetch_members();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to remove member");
      });
  }

  useEffect(() => {
    fetch_members();
  }, []);

  return (
    <MemberContext.Provider value={{ members, add_member, update_member, delete_member }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => useContext(MemberContext);
