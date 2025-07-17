import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

export default function Layout(){
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className='flex-1'>
                <Outlet />
                <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick
                    rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"  />
            </div>
            <Footer />
        </div>
    )
}