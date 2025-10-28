import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { useApp } from '../context/appContext'
import MoodDetector from '../components/moodDetector'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function AppLayout() {
  const { user, isLoading } = useApp()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  // Welcome message when user logs in - only shown in AppLayout, not in Homepage
  useEffect(() => {
    if (user && !isLoading) {
      toast.success(`Welcome back, ${user.displayName || 'User'}! 👋`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: "welcome-toast"
      });
    }
  }, [user, isLoading]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      {user && !isLoading && isHomePage && <MoodDetector />}
      <ToastContainer 
        position="bottom-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="dark"
        limit={3}
      />
    </div>
  )
}

export default AppLayout