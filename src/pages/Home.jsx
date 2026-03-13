import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import PostCard from '../components/PostCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, SlidersHorizontal, Sparkles, LayoutGrid, 
    Calendar as CalendarIcon, ChevronDown, Check, X 
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isSameDay } from 'date-fns';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        if (!user || !user.token) {
            logout(); // Clear invalid session
            navigate('/login');
            return;
        }

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/posts`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [user, navigate]);

    const filterByTime = (posts) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        return posts.filter(post => {
            if (!post.createdAt) return timeFilter === 'all';
            const postDate = new Date(post.createdAt);

            if (selectedDate) {
                return isSameDay(postDate, selectedDate);
            }

            switch (timeFilter) {
                case 'day':
                    return postDate >= startOfDay;
                case 'week':
                    return postDate >= startOfWeek;
                case 'month':
                    return postDate >= startOfMonth;
                case 'year':
                    return postDate >= startOfYear;
                default:
                    return true;
            }
        });
    };

    const filteredPosts = filterByTime(posts).filter(post => {
        const title = (post.title || "").toLowerCase();
        const description = (post.description || "").toLowerCase();
        const searchNormalized = searchTerm.toLowerCase().trim();
        
        if (searchNormalized === "") return true;

        // 1. Space-Insensitive Match (e.g., 'task1' matches 'TASK 1')
        const contentFlat = (title + description).replace(/\s+/g, '');
        const searchFlat = searchNormalized.replace(/\s+/g, '');
        if (contentFlat.includes(searchFlat)) return true;

        // 2. Word-by-Word Match (e.g., 'task 1' matches entries containing both)
        const searchWords = searchNormalized.split(/\s+/);
        return searchWords.every(word => 
            title.includes(word) || description.includes(word)
        );
    });

    const filterOptions = [
        { id: 'all', label: 'All Records' },
        { id: 'day', label: 'Today' },
        { id: 'week', label: 'Last 7 Days' },
        { id: 'month', label: 'This Month' },
        { id: 'year', label: 'This Year' }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0a0f] pb-20 w-full overflow-x-hidden">
            {/* System Header Section */}
            <div className="relative pt-12 pb-16 px-6">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-[#a855f7]/[0.02] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl md:rounded-[3rem] bg-[#16141c] border border-[#221f2b] p-6 md:p-10 shadow-3xl"
                    >
                        <div className="flex flex-col gap-6 md:gap-10">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#a855f7] uppercase tracking-[0.3em]">
                                        <Sparkles size={14} /> Global Stream Access
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black font-outfit text-white uppercase italic tracking-tighter">
                                        System <span className="text-[#a855f7]">Archive</span>
                                    </h2>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        Managing {filteredPosts.length} secured data entries
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        className="h-12 w-12 rounded-2xl bg-[#0b0a0f] border border-[#221f2b] flex items-center justify-center text-slate-500 hover:text-white hover:border-[#a855f7]/50 transition-all shadow-xl"
                                        title="System Refresh"
                                        onClick={() => window.location.reload()}
                                    >
                                        <Sparkles size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-stretch gap-4">
                                {/* Calendar Selection Button */}
                                <div className="flex-1 lg:flex-none relative">
                                    <button 
                                        onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsFilterOpen(false); }}
                                        className={`w-full h-full px-8 py-5 rounded-3xl border flex items-center gap-4 transition-all min-w-[240px] justify-between group ${
                                            selectedDate ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-lg shadow-[#a855f7]/20' : 'bg-[#0b0a0f] border-[#221f2b] text-slate-400 hover:text-white hover:border-[#a855f7]/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <CalendarIcon size={18} className={selectedDate ? 'text-white' : 'text-[#a855f7]'} />
                                            <span className="text-xs font-black uppercase tracking-[0.2em] truncate">
                                                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Pick Date'}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isCalendarOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute top-full left-0 mt-4 p-4 rounded-[2rem] bg-[#16141c] border border-[#221f2b] shadow-2xl z-50"
                                            >
                                                <style>{`
                                                    .rdp { --rdp-accent-color: #a855f7; --rdp-background-color: #a855f7; color: white; margin: 0; }
                                                    .rdp-day_selected { background-color: var(--rdp-accent-color) !important; color: white !important; }
                                                `}</style>
                                                <DayPicker
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={(date) => {
                                                        setSelectedDate(date);
                                                        setIsCalendarOpen(false);
                                                    }}
                                                    className="m-0"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Quick Filters */}
                                <div className="flex-1 lg:flex-none relative">
                                    <button 
                                        onClick={() => { setIsFilterOpen(!isFilterOpen); setIsCalendarOpen(false); }}
                                        className="w-full h-full px-8 py-5 rounded-3xl bg-[#0b0a0f] border border-[#221f2b] text-slate-400 hover:text-white hover:border-[#a855f7]/50 flex items-center gap-4 transition-all min-w-[200px] justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <SlidersHorizontal size={18} className="text-[#a855f7]" />
                                            <span className="text-xs font-black uppercase tracking-[0.2em] truncate">
                                                {filterOptions.find(o => o.id === timeFilter)?.label}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isFilterOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute top-full left-0 right-0 mt-4 p-3 rounded-[2rem] bg-[#16141c] border border-[#221f2b] shadow-2xl z-50 overflow-hidden"
                                            >
                                                {filterOptions.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => {
                                                            setTimeFilter(option.id);
                                                            setSelectedDate(null);
                                                            setIsFilterOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                                                            timeFilter === option.id && !selectedDate
                                                            ? 'bg-[#a855f7] text-white shadow-lg shadow-[#a855f7]/20' 
                                                            : 'text-slate-500 hover:bg-[#0b0a0f] hover:text-white'
                                                        }`}
                                                    >
                                                        {option.label}
                                                        {timeFilter === option.id && !selectedDate && <Check size={14} />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Compact Search Input */}
                                <div className="flex-1 relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a855f7] transition-all group-focus-within:scale-110" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="SEARCH ARCHIVE..."
                                        className="w-full h-full bg-[#0b0a0f] border border-[#221f2b] rounded-3xl py-5 pl-14 pr-6 text-white text-[10px] font-black uppercase tracking-[0.3em] focus:outline-none focus:border-[#a855f7] transition-all placeholder-slate-800"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-px bg-[#221f2b] hidden md:block" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Feed */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12 pb-6 border-b border-[#221f2b]">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#16141c] border border-[#221f2b] text-[10px] font-bold text-slate-400 cursor-pointer hover:border-[#a855f7]/50 transition-all">
                           <LayoutGrid size={14} className="text-[#a855f7]" /> GRID MODE
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 tracking-[0.2em] uppercase">
                            {filteredPosts.length} Records Located
                        </div>
                    </div>
                    {selectedDate && (
                        <button 
                            onClick={() => setSelectedDate(null)}
                            className="text-[10px] font-bold text-[#a855f7] uppercase tracking-widest flex items-center gap-2 hover:underline"
                        >
                            CLEAR CALENDAR FILTER <X size={12} />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="h-12 w-12 border-4 border-[#a855f7]/10 border-t-[#a855f7] rounded-full animate-spin" />
                        <p className="text-slate-700 font-bold uppercase tracking-[0.4em] text-[10px]">Accessing Archive...</p>
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredPosts.map((post) => (
                            <PostCard 
                                key={post._id} 
                                post={post} 
                                onDelete={(id) => setPosts(posts.filter(p => p._id !== id))}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-40 rounded-[4rem] bg-[#16141c] border border-dashed border-[#221f2b]">
                        <Search className="text-slate-800 mx-auto mb-6" size={48} />
                        <h3 className="text-2xl font-bold text-white font-outfit mb-2 uppercase tracking-tight italic">No records located</h3>
                        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Try adjusting your system search parameters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
