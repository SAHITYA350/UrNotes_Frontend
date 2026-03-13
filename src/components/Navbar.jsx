import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle, User, Menu, X, Home, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Explore', path: '/', icon: <Home size={18} /> },
        ...(user ? [
            { name: 'Dashboard', path: '/profile', icon: <LayoutDashboard size={18} /> },
            { name: 'New Post', path: '/create-post', icon: <PlusCircle size={18} /> }
        ] : [])
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 z-50 w-full transition-all duration-300 glass-silk">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a855f7] transition-transform group-hover:scale-105">
                            <PlusCircle size={22} className="text-white fill-white/10" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-white font-outfit uppercase italic">
                            UrNotes
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors ${
                                    location.pathname === link.path ? 'text-white' : 'text-slate-500 hover:text-white'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {!user ? (
                            <div className="flex items-center gap-6 pl-4 border-l border-[#221f2b]">
                                <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Login</Link>
                                <Link to="/signup" className="px-5 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-[#a855f7] hover:text-white transition-all">Sign Up</Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-[#221f2b]">
                                <Link to="/profile" className="h-9 w-9 rounded-full bg-[#16141c] border border-[#221f2b] overflow-hidden flex items-center justify-center ring-2 ring-transparent hover:ring-[#a855f7]/30 transition-all">
                                    {user.avatar ? (
                                        <img src={user.avatar} className="h-full w-full object-cover" />
                                    ) : (
                                        <User size={18} className="text-slate-400" />
                                    )}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16141c] border border-[#221f2b] text-slate-400 md:hidden"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] md:hidden"
                        />
                        
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-80 bg-[#0b0a0f] border-l border-[#221f2b] z-50 md:hidden overflow-y-auto"
                        >
                            <div className="flex flex-col h-full p-8 space-y-10">
                                {/* Mobile Header: Close Button + Brand */}
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black font-outfit uppercase italic tracking-tight text-white">System Menu</span>
                                    <button onClick={() => setIsOpen(false)} className="p-2 bg-[#16141c] rounded-xl text-slate-400">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* User Profile Section */}
                                {user && (
                                    <div className="p-6 rounded-3xl bg-[#16141c] border border-[#221f2b] space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-full bg-[#0b0a0f] border border-[#221f2b] overflow-hidden flex items-center justify-center ring-2 ring-[#a855f7]/20">
                                                {user.avatar ? (
                                                    <img src={user.avatar} className="h-full w-full object-cover" />
                                                ) : (
                                                    <User size={24} className="text-slate-600" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-bold text-white font-outfit truncate max-w-[140px]">{user.username}</span>
                                                <span className="text-[10px] uppercase font-bold text-[#a855f7] tracking-widest">Active User</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Links */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-4 ml-1">Navigation</p>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-4 rounded-2xl p-4 text-base font-bold transition-all ${
                                                location.pathname === link.path 
                                                ? 'bg-[#a855f7] text-white' 
                                                : 'text-slate-400 hover:bg-[#16141c] hover:text-white'
                                            }`}
                                        >
                                            <span className={location.pathname === link.path ? 'text-white' : 'text-[#a855f7]'}>
                                                {link.icon || <Home size={20}/>}
                                            </span>
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Actions (Login/Signup/Logout) */}
                                <div className="pt-6 border-t border-[#221f2b] mt-auto">
                                    {!user ? (
                                        <div className="space-y-4">
                                            <Link 
                                                to="/login" 
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-[#221f2b] text-white font-bold hover:bg-white/5 transition-all"
                                            >
                                                <LogIn size={20} />
                                                <span>Login</span>
                                            </Link>
                                            <Link 
                                                to="/signup" 
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#a855f7] hover:text-white transition-all"
                                            >
                                                <span>Initialize Account</span>
                                            </Link>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all uppercase tracking-widest text-xs"
                                        >
                                            <div className="p-2 bg-red-500/10 rounded-xl">
                                                <LogOut size={20} />
                                            </div>
                                            <span>Logout</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
