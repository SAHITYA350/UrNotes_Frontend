import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Save, X, ArrowLeft, Loader2, Info } from 'lucide-react';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/posts`);
                const post = response.data.find(p => p._id === id);
                if (post) {
                    setTitle(post.title);
                    setDescription(post.description);
                    setPreview(post.image);
                }
            } catch (error) {
                toast.error("Failed to load post");
            } finally {
                setFetching(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return toast.error("Title and Description are required");
        
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            await axios.put(`${API_URL}/api/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            toast.success('Post updated successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update post');
        } finally {
            setIsLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen flex items-center justify-center text-white">Loading post...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium font-outfit">Back</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-8"
            >
                {/* Form Section */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold font-outfit text-white">Edit Post</h1>
                        <p className="text-slate-400">Update your content and save changes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-[#1e293b]/40 p-8 shadow-2xl backdrop-blur-sm">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Title</label>
                                <input 
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                    placeholder="Enter title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Description</label>
                                <textarea 
                                    className="w-full bg-black/20 border border-white/10 rounded-3xl py-4 px-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium min-h-[150px] resize-none"
                                    placeholder="Update description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-5 text-lg font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Image Upload Section */}
                <div className="lg:col-span-2">
                    <div className="sticky top-28 space-y-4">
                        <label className="block text-sm font-semibold text-slate-300 ml-1">Featured Image</label>
                        <div 
                            className={`relative aspect-[4/5] rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
                                preview ? 'border-indigo-500' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                            }`}
                            onClick={() => document.getElementById('image-upload').click()}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Image</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8 space-y-4">
                                    <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-500">
                                        <ImageIcon size={40} />
                                    </div>
                                    <p className="text-white font-bold text-sm">Upload Image</p>
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
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EditPost;
