import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserContext } from './context/UserContext'; 
import { useState } from 'react';

const GOOGLE_CLIENT_ID = '54790823933-pl1q47ujvtjdefs0bvnf37qk7rhl63ku.apps.googleusercontent.com'; 

function Root() {
  const [user, setUser] = useState(null); 
  const [auth_token, setAuthToken] = useState(null);

  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContext.Provider value={{ auth_token, setAuthToken, user, setUser }}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContext.Provider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
