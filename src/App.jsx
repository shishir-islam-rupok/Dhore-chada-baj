import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

export default function App(){
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
          {/* Conditionally render Navbar? Or just let Admin page handle its own layout? 
              AdminDashboard has its own layout. AdminLogin is fullscreen. 
              Maybe hide Navbar for admin routes? 
              For simplicity, let's keep Navbar but maybe we can hide it via css or location check if needed.
              Actually, AdminDashboard covers full screen, so it's fine.
           */}
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Fallback */}
              <Route path="/report" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}
