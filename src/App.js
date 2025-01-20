// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/homepage/Homepage';
import Loginpage from './pages/loginpage/Loginpage';
import Registerpage from './pages/registerpage/Registerpage';
import Profilepage from './pages/profile/Profilepage';
import Communities from './pages/communities/Communities';
import ContactUs from './pages/contact/ContactUs';
import Footer from './components/Footer'; // Updated import path

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container"> {/* Add this wrapper div */}
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="main-content"> {/* Add this main wrapper */}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated 
                  ? <Navigate to="/" replace /> 
                  : <Loginpage onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated 
                  ? <Navigate to="/" replace /> 
                  : <Registerpage />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isAuthenticated 
                  ? <Profilepage onLogout={handleLogout} /> 
                  : <Navigate to="/login" replace />
              } 
            />
            <Route path="/communities" element={<Communities />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer /> {/* Add Footer here */}
      </div>
    </Router>
  );
}

export default App;