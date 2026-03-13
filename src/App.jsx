import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const AppContent = () => {
    return (
        <div className="min-h-screen bg-[#0b0a0f] text-slate-50 selection:bg-[#a855f7]/30">
            <Navbar />
            <main className="w-full pt-20">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                    <Route path="/edit-post/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#1e293b',
                    color: '#f8fafc',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            }} />
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;