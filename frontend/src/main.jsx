import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
<<<<<<< HEAD
import { UserContext } from './context/UserContext';
=======
import { UserProvider } from './context/UserContext'; // use UserProvider, not just UserContext
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef

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

<<<<<<< HEAD
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootProvider />
  </React.StrictMode>
);
=======
function Root() {
  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <UserProvider>
              <App />
          </UserProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
