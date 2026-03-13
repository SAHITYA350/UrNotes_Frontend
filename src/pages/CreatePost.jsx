import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, X, ArrowLeft, Loader2, Info, FileStack } from 'lucide-react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return toast.error("Essential fields missing");
        
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            await axios.post(`${API_URL}/api/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            toast.success('Record Analyzed & Archived');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Archive Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0a0f] py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-10 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    Back to Terminal
                </button>

                <div className="flex items-center gap-4 mb-12">
                     <div className="p-3 bg-[#a855f7]/10 rounded-2xl text-[#a855f7] border border-[#a855f7]/20">
                        <FileStack size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black font-outfit text-white uppercase italic tracking-tight">
                            Initialize <span className="text-[#a855f7]">New Entry</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Populate the system archive with new validated data.</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* Form Section */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="p-10 rounded-[2.5rem] bg-[#16141c] border border-[#221f2b] shadow-2xl space-y-8">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Archive Title</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-[#0b0a0f] border border-[#221f2b] rounded-2xl py-5 px-6 text-white placeholder-slate-800 transition-all outline-none focus:border-[#a855f7]/50 font-bold text-lg"
                                        placeholder="Identification handle..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Core Description</label>
                                    <textarea 
                                        className="w-full bg-[#0b0a0f] border border-[#221f2b] rounded-[2rem] py-5 px-6 text-white placeholder-slate-800 transition-all outline-none focus:border-[#a855f7]/50 font-medium min-h-[200px] resize-none"
                                        placeholder="Record details and log data..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-[#a855f7] hover:text-white transition-all disabled:opacity-50 shadow-xl shadow-black/20"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin mx-auto" />
                                ) : (
                                    <span>Sync to Global Archive</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Image Upload Section */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 space-y-6">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Visual Asset Log</label>
                            <div 
                                className={`relative aspect-[4/5] rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
                                    preview ? 'border-[#a855f7] bg-[#16141c]' : 'border-[#221f2b] bg-[#16141c]/50 hover:bg-[#16141c] hover:border-slate-700'
                                }`}
                                onClick={() => document.getElementById('image-upload').click()}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                                            <p className="text-white font-bold text-xs uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/10">Re-upload Asset</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-12 space-y-6">
                                        <div className="h-24 w-24 rounded-full bg-[#0b0a0f] border border-[#221f2b] flex items-center justify-center mx-auto text-slate-700">
                                            <ImageIcon size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-white font-bold uppercase tracking-widest text-sm">Upload Media</p>
                                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-tight">JPG, PNG, WEBP (MAX 5MB)</p>
                                        </div>
                                    </div>
                                )}
                                <input 
                                    id="image-upload"
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            
                            <div className="p-6 rounded-3xl bg-[#16141c] border border-[#221f2b] flex items-start gap-4">
                                <Info className="text-[#a855f7] shrink-0" size={20} />
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    All entries are subject to system validation. Ensure your records are accurate and decentralized for public viewing.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreatePost;
