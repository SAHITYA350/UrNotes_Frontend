import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(username, email, password);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 bg-[#0b0a0f]">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16141c] border border-[#221f2b] text-[10px] font-bold uppercase tracking-widest text-[#a855f7] mb-2">
                        <UserPlus size={12} /> Create Account
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white font-outfit uppercase italic">
                        Sign <span className="text-[#a855f7]">Up</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                        Join our community today
                    </p>
                </div>

                <div className="rounded-3xl md:rounded-[2.5rem] border border-[#221f2b] bg-[#16141c] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-600">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full rounded-2xl border border-[#221f2b] bg-[#0b0a0f] py-4 pl-14 pr-4 text-white transition-all focus:border-[#a855f7]/50 outline-none"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-600">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full rounded-2xl border border-[#221f2b] bg-[#0b0a0f] py-4 pl-14 pr-4 text-white transition-all focus:border-[#a855f7]/50 outline-none"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-600">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full rounded-2xl border border-[#221f2b] bg-[#0b0a0f] py-4 pl-14 pr-4 text-white transition-all focus:border-[#a855f7]/50 outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
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
                                    <span>Sign Up</span>
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#a855f7] hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
