import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 bg-[#0b0a0f]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-3">
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16141c] border border-[#221f2b] text-[10px] font-bold uppercase tracking-widest text-[#a855f7] mb-4"
                    >
                        <Sparkles size={12} /> Secure Authentication Portal
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white font-outfit uppercase italic">
                        Login
                    </h2>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                        Enter your credentials to access your account
                    </p>
                </div>

                <div className="rounded-3xl md:rounded-[2.5rem] border border-[#221f2b] bg-[#16141c] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-600 transition-colors group-focus-within:text-[#a855f7]">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full rounded-2xl border border-[#221f2b] bg-[#0b0a0f] py-4 pl-14 pr-4 text-white placeholder-slate-800 transition-all outline-none focus:border-[#a855f7]/50"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-600 transition-colors group-focus-within:text-[#a855f7]">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full rounded-2xl border border-[#221f2b] bg-[#0b0a0f] py-4 pl-14 pr-4 text-white placeholder-slate-800 transition-all outline-none focus:border-[#a855f7]/50"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link to="/signup" className="text-xs font-bold text-slate-500 hover:text-[#a855f7] transition-colors uppercase tracking-widest">
                                Register Now
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-[#a855f7] hover:text-white disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                            ) : (
                                <>
                                    <span>Login</span>
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
