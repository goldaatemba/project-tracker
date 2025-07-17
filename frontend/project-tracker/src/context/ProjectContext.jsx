import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { toast } from 'react-toastify';
import { api_url } from '../config.json';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { auth_token } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [onChange, setOnChange] = useState(false); // trigger re-fetch

  // === Fetch All Projects ===
  const fetch_projects = () => {
    fetch(`${api_url}/projects`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => setProjects(data))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load projects');
      });
  };

  // === Create a Project ===
  const add_project = (title, description, github_link, deployed_link, cohort_id, tech_stack) => {
    toast.loading('Creating project...');
    fetch(`${api_url}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({
        title,
        description,
        github_link,
        deployed_link,
        cohort_id,
        tech_stack,
      }),
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) toast.error(data.error);
        else {
          toast.success('Project created!');
          setOnChange(!onChange);
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error('Failed to create project');
      });
  };

  // === Update Project ===
  const update_project = (id, updatedFields) => {
    fetch(`${api_url}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify(updatedFields),
    })
      .then(res => res.json())
      .then(data => {
        toast.success('Project updated');
        setOnChange(!onChange);
      })
      .catch(() => {
        toast.error('Failed to update project');
      });
  };

  // === Delete Project ===
  const delete_project = (id) => {
    fetch(`${api_url}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        toast.success('Project deleted');
        setOnChange(!onChange);
      })
      .catch(() => {
        toast.error('Error deleting project');
      });
  };

  useEffect(() => {
    if (auth_token) fetch_projects();
  }, [auth_token, onChange]);

  const contextData = {
    projects,
    fetch_projects,
    add_project,
    update_project,
    delete_project,
  };

  return (
    <ProjectContext.Provider value={contextData}>
      {children}
    </ProjectContext.Provider>
  );
};
