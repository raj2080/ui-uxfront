import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import { isLoggedIn } from './apis/Api';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Lazy load components for better performance
const Homepage = React.lazy(() => import('./pages/homepage/Homepage'));
const Loginpage = React.lazy(() => import('./pages/loginpage/Loginpage'));
const Registerpage = React.lazy(() => import('./pages/registerpage/Registerpage'));
const Profilepage = React.lazy(() => import('./pages/profile/Profilepage'));
const Communities = React.lazy(() => import('./pages/communities/Communities'));
const ContactUs = React.lazy(() => import('./pages/contactus/ContactUs'));
const CreateConfession = React.lazy(() => import('./pages/confession/CreateConfession'));
const EditConfession = React.lazy(() => import('./pages/confession/EditConfession')); // Newly added component

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authenticated = isLoggedIn();

  useEffect(() => {
    if (!authenticated) {
      localStorage.setItem('redirectUrl', location.pathname);
    }
  }, [authenticated, location]);

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const location = useLocation();
  const authenticated = isLoggedIn();

  if (authenticated) {
    const redirectUrl = localStorage.getItem('redirectUrl') || '/';
    localStorage.removeItem('redirectUrl');
    return <Navigate to={redirectUrl} replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = isLoggedIn();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(user);
        localStorage.setItem('lastActive', new Date().toISOString());
      } else {
        setCurrentUser(null);
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    
    // Check auth status every minute
    const interval = setInterval(checkAuthStatus, 60000);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActive');
    localStorage.removeItem('redirectUrl');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
          user={currentUser}
        />
        
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/contact" element={<ContactUs />} />

              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Loginpage onLogin={handleLogin} />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Registerpage />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profilepage onLogout={handleLogout} user={currentUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-confession"
                element={
                  <ProtectedRoute>
                    <CreateConfession user={currentUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-confession/:id"
                element={
                  <ProtectedRoute>
                    <EditConfession user={currentUser} />
                  </ProtectedRoute>
                }
              />

              {/* Confession Routes */}
              <Route
                path="/confessions"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Homepage />
                  </Suspense>
                }
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="error-page">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <button onClick={() => window.history.back()}>
                      Go Back
                    </button>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;