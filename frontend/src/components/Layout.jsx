<<<<<<< HEAD
import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
=======
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
>>>>>>> 1b55526cae0080c3029a1b6157556d0d8e62daa6
import { ToastContainer } from 'react-toastify';


export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("access_token");
        }
      } catch (err) {
        console.error("Token check failed:", err);
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  return (
    <div>
<<<<<<< HEAD
        <Navbar />
=======
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
>>>>>>> 1b55526cae0080c3029a1b6157556d0d8e62daa6

        <div className='container mx-auto min-h-[80vh] p-4' >
                    <Outlet />

                     <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false}
                      rtl={false} pauseOnFocusLoss draggableposition pauseOnHover theme="light" />
        </div>

        <Footer />
    </div>
<<<<<<< HEAD
  )
}
=======
  );
}
>>>>>>> 1b55526cae0080c3029a1b6157556d0d8e62daa6
