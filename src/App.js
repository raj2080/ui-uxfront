import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/homepage/Homepage';
import Loginpage from './pages/loginpage/Loginpage';
import Registerpage from './pages/registerpage/Registerpage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to update authentication status
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage onLogin={handleLogin} />} />
        <Route path="/register" element={<Registerpage />} />
      </Routes>
    </Router>
  );
}

export default App;