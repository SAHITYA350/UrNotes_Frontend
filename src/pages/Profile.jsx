import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera, User, Save, Loader2, ArrowLeft, 
    Image as ImageIcon, Grid, BarChart3, TrendingUp, 
    Layers, Activity, Clock, LayoutDashboard, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import PostCard from '../components/PostCard';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter, subDays, format, isSameDay } from 'date-fns';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(user?.avatar || null);
    const [isLoading, setIsLoading] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/posts`);
                // Support both populated and unpopulated author field
                const filtered = response.data.filter(post => {
                    const authorId = post.author?._id || post.author;
                    return authorId === user?._id;
                });
                setUserPosts(filtered);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            } finally {
                setPostsLoading(false);
            }
        };

        if (user) fetchUserPosts();
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('username', username);
        if (avatar) formData.append('avatar', avatar);

        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePost = (postId) => {
        setUserPosts(userPosts.filter(p => p._id !== postId));
    };

    // Advanced Analytic Calculations
    const getSystemStats = () => {
        const now = new Date();
        const today = startOfDay(now);
        const week = startOfWeek(now);
        const month = startOfMonth(now);

        const stats = [
            { 
                label: 'Today', 
                value: userPosts.filter(p => p.createdAt && isAfter(new Date(p.createdAt), today)).length, 
                icon: <Activity size={20} />, 
                color: 'text-emerald-400' 
            },
            { 
                label: 'Last 7 Days', 
                value: userPosts.filter(p => p.createdAt && isAfter(new Date(p.createdAt), week)).length, 
                icon: <Clock size={20} />, 
                color: 'text-amber-400' 
            },
            { 
                label: 'This Month', 
                value: userPosts.filter(p => p.createdAt && isAfter(new Date(p.createdAt), month)).length, 
                icon: <Calendar size={20} />, 
                color: 'text-indigo-400' 
            },
            { 
                label: 'Total Record', 
                value: userPosts.length, 
                icon: <Layers size={20} />, 
                color: 'text-purple-400' 
            }
        ];
        return stats;
    };

    // Generate Pulse Data for Chart (Last 7 Days)
    const getPulseData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const count = userPosts.filter(p => {
                if (!p.createdAt) return false;
                return isSameDay(new Date(p.createdAt), date);
            }).length;
            
            data.push({
                day: format(date, 'EEE'),
                count: count
            });
        }
        return data;
    };

    const stats = getSystemStats();
    const pulseData = getPulseData();
    const maxPulse = Math.max(...pulseData.map(d => d.count), 1);

    return (
        <div className="min-h-screen bg-[#0b0a0f] text-white py-12 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#221f2b]">
                    <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#a855f7]">
                            <LayoutDashboard size={14} /> System Analytics Dashboard
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black font-outfit uppercase italic tracking-tighter">
                            Control <span className="text-[#a855f7]">Panel</span>
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Profile Card & System Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="p-10 rounded-[2.5rem] bg-[#16141c] border border-[#221f2b] flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a855f7]/50 to-transparent" />
                            
                            <div className="relative mb-8">
                                <div className="h-40 w-40 rounded-full ring-8 ring-[#a855f7]/10 ring-offset-4 ring-offset-[#16141c] overflow-hidden bg-[#0b0a0f] flex items-center justify-center">
                                    {preview ? (
                                        <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User size={80} className="text-slate-700" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 h-11 w-11 bg-[#a855f7] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-[#a855f7]/20">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full space-y-4">
                                <input 
                                    type="text"
                                    className="w-full bg-[#0b0a0f]/50 border border-[#221f2b] rounded-2xl py-4 px-6 text-2xl font-bold text-center text-white focus:outline-none focus:border-[#a855f7]/50 transition-all font-outfit uppercase italic"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                />
                                <div className="text-[10px] font-bold bg-[#a855f7]/10 text-[#a855f7] px-6 py-2 rounded-full inline-block uppercase tracking-[0.2em]">
                                    {user?.email}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-6 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-[#a855f7] hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Update Core Profile'}
                                </button>
                            </form>
                        </div>

                        {/* Analytic Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {stats.map((stat, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i} 
                                    className="p-6 rounded-[2rem] bg-[#16141c] border border-[#221f2b] flex items-center justify-between cursor-pointer hover:border-[#a855f7]/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl bg-[#0b0a0f] border border-[#221f2b] ${stat.color}`}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-600 mb-1">{stat.label}</p>
                                            <p className="text-2xl font-black font-outfit uppercase italic leading-none">{stat.value}</p>
                                        </div>
                                    </div>
                                    <TrendingUp size={16} className="text-[#a855f7] opacity-20 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Records / Analytics Visualization */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* System Pulse Analytics - Visualized */}
                        <div className="p-8 rounded-[3rem] bg-[#16141c] border border-[#221f2b] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <BarChart3 size={120} />
                            </div>
                            
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#a855f7] font-outfit">System Pulse</h3>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Entry activity over last 7 cycles</p>
                                </div>
                                <Activity className="text-[#a855f7] animate-pulse" size={20} />
                            </div>

                            <div className="relative h-48 mt-4 border-b border-[#221f2b] pb-2">
                                {/* Activity Baseline */}
                                <div className="absolute bottom-2 left-0 w-full h-px bg-[#221f2b]/50 z-0" />
                                
                                <div className="flex items-end gap-2 h-full relative z-10 px-2 min-h-[160px]">
                                    {pulseData.map((data, i) => {
                                        const isToday = i === 6;
                                        // Create an array of dots based on the count for that day
                                        const dots = Array.from({ length: data.count });
                                        
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group pb-6">
                                                <div className="w-full relative flex flex-col items-center justify-end min-h-[120px] gap-2">
                                                    
                                                    {/* Individual Activity Nodes - One per record */}
                                                    <AnimatePresence>
                                                        {dots.map((_, dotIdx) => (
                                                            <motion.div 
                                                                key={`${i}-${dotIdx}`}
                                                                initial={{ opacity: 0, scale: 0, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                transition={{ delay: dotIdx * 0.1 }}
                                                                className={`w-3 h-3 rounded-full border-2 border-[#16141c] z-30 shadow-lg ${
                                                                    isToday 
                                                                    ? 'bg-[#a855f7] shadow-[#a855f7]/40 ring-4 ring-[#a855f7]/10' 
                                                                    : 'bg-slate-700 shadow-black/40'
                                                                }`}
                                                            />
                                                        ))}
                                                    </AnimatePresence>

                                                    {/* Connection Line Baseline */}
                                                    <div className={`w-[2px] h-full absolute bottom-0 transition-opacity duration-500 ${
                                                        data.count > 0 ? 'opacity-20 bg-gradient-to-t from-[#a855f7] to-transparent' : 'opacity-0'
                                                    }`} />

                                                    {/* Tooltip on Hover */}
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-xl font-black text-[9px] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none shadow-2xl uppercase italic">
                                                        {data.count} SYNCED RECORDS
                                                    </div>
                                                </div>

                                                {/* Day Axis Label */}
                                                <div className="absolute bottom-0 text-center w-full">
                                                    <span className={`text-[10px] font-black tracking-tighter transition-colors ${isToday ? 'text-[#a855f7]' : 'text-slate-700'}`}>
                                                        {data.day}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Records Header */}
                        <div className="flex items-center justify-between pt-4">
                            <h2 className="text-3xl font-black font-outfit uppercase italic flex items-center gap-3">
                                <Grid className="text-[#a855f7]" size={28} /> Records <span className="text-slate-700">Archive</span>
                            </h2>
                        </div>

                        {postsLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-[#a855f7]" size={40} />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Data...</p>
                            </div>
                        ) : userPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatePresence>
                                    {userPosts.map((post) => (
                                        <motion.div
                                            key={post._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <PostCard post={post} onDelete={handleDeletePost} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="p-24 text-center rounded-[3rem] bg-[#16141c] border border-dashed border-[#221f2b]">
                                <ImageIcon size={64} className="text-slate-900 mx-auto mb-6" />
                                <p className="text-slate-600 text-lg font-bold uppercase tracking-widest">No active entries found.</p>
                                <button 
                                    onClick={() => navigate('/create-post')}
                                    className="mt-8 px-10 py-4 rounded-2xl bg-transparent border border-[#221f2b] text-[#a855f7] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#a855f7] hover:text-white transition-all"
                                >
                                    Initialize New Data Stream
                                </button>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
