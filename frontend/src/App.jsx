import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-100/50 dark:bg-gray-900/50 transition-colors duration-200">
            <AnimatedBackground />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="relative z-10">
                      <Navbar onMenuClick={() => setSidebarOpen(true)} />
                      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                      <main className="lg:pl-64 pt-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/users" element={<UserList />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
