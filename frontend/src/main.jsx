import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserContext } from './context/UserContext';

const GOOGLE_CLIENT_ID = '54790823933-pl1q47ujvtjdefs0bvnf37qk7rhl63ku.apps.googleusercontent.com';

function RootProvider() {
  const [user, setUser] = useState(null);
  const [auth_token, setAuthToken] = useState(null);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContext.Provider value={{ auth_token, setAuthToken, user, setUser }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootProvider />
  </React.StrictMode>
);
