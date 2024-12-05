import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-main dark:bg-dark-bg-primary">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#2D2D2D' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
              borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;