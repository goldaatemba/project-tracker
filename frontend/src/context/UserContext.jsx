import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const api_url = import.meta.env.VITE_API_URL;



export const UserContext = createContext({
  auth_token: null,
  setAuthToken: () => {},
  user: null,
  setUser: () => {},
});


export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [auth_token, setAuthToken] = useState(() => localStorage.getItem("access_token"));

  console.log("Current User state variable:", currentUser);

  // ========= Register User =========
  function register_user(username, email, password, department) {
    toast.loading("Registering user...");

    fetch(`${api_url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) toast.error(data.error);
        else if (data.success) {
          toast.success(data.success);
          navigate("/login");
        } else {
          toast.error("An unexpected error occurred while registering.");
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Network error during registration.");
      });
  }

  // ========= Login User =========
  function login_user(email, password, redirect = "/access") {
    toast.loading("Logging you in...");

    fetch(`${api_url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) toast.error(data.error);
        else if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          setAuthToken(data.access_token);

          // Fetch current user after login
          fetch(`${api_url}/current_user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.access_token}`,
            },
          })
            .then(res => res.json())
            .then(userData => {
              if (userData.is_blocked) {
                toast.error("Your account is blocked. Contact admin.");
                localStorage.removeItem("access_token");
                setAuthToken(null);
              } else {
                setCurrentUser(userData);
                toast.success("Logged in successfully!");
                navigate(redirect);
              }
            });
        } else {
          toast.error("Login failed. Try again.");
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Network error during login.");
      });
  }

  // ========= Logout User =========
  function logout_user() {
    fetch(`${api_url}/logout`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success(data.success);
          localStorage.clear();
          setAuthToken(null);
          setCurrentUser(null);
          navigate("/login");
        } else {
          toast.error("Logout failed.");
        }
      })
      .catch(() => toast.error("Error logging out."));
  }

  // ========= Update Profile =========
  function update_user_profile(username, email, password, newPassword) {
    toast.loading("Updating profile...");

    fetch(`${api_url}/update_user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ username, email, password, newPassword }),
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) toast.error(data.error);
        else if (data.success) toast.success(data.success);
        else toast.error("An error occurred while updating profile.");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Network error during update.");
      });
  }

  // ========= Delete Profile =========
  function delete_profile() {
    toast.loading("Deleting profile...");

    fetch(`${api_url}/delete_user_profile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) toast.error(data.error);
        else if (data.success) {
          toast.success(data.success);
          localStorage.clear();
          setAuthToken(null);
          setCurrentUser(null);
          navigate("/login");
        } else toast.error("Unexpected error during deletion.");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Network error while deleting profile.");
      });
  }

  // ========= Get Current User =========
  useEffect(() => {
    if (auth_token) {
      fetch(`${api_url}/current_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            toast.error(data.error);
          } else {
            console.log("Fetched current user:", data);
            setCurrentUser(data);
          }
        })
        .catch(() => {
          toast.error("Error fetching user data.");
        });
    }
  }, [auth_token]);

  // ========= Context Export =========
  const context_data = {
    auth_token,
    currentUser,
    register_user,
    login_user,
    logout_user,
    update_user_profile,
    delete_profile,
  };

  return <UserContext.Provider value={context_data}>{children}</UserContext.Provider>;
};