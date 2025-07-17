import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import NoPage from './pages/NoPage';
import Profile from './pages/Profile';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NoPage />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
     
    </>
  )
}

export default App
