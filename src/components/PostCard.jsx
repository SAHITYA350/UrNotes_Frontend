import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileDown, Image as ImageIcon, User, Calendar, Trash2, Edit, Share2, MoreVertical } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, onDelete }) => {
    const cardRef = useRef();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthor = user && post.author && (user._id === post.author._id || user._id === post.author);

    const exportAsPNG = async () => {
        if (!cardRef.current) return;
        
        try {
            toast.loading("Generating high-res capture...", { id: "export" });
            
            const options = {
                useCORS: true,
                allowTaint: false, // Ensure we don't taint the canvas
                backgroundColor: '#16141c',
                scale: 2, 
                logging: false,
                onclone: (clonedDoc) => {
                    // 1. Critical Fix: Strip oklch references from all style tags in the clone
                    // html2canvas crashes when it encounters oklch() color functions
                    const styles = clonedDoc.getElementsByTagName('style');
                    for (let s of styles) {
                        s.innerHTML = s.innerHTML.replace(/oklch\([^)]+\)/g, '#a855f7');
                    }

                    // 2. Hide the action menu
                    const menu = clonedDoc.querySelector('[data-export-hide]');
                    if (menu) menu.style.display = 'none';
                    
                    // 3. Reset transforms and force visibility
                    const card = clonedDoc.getElementById(`post-card-${post._id}`);
                    if (card) {
                        card.style.transform = 'none';
                        card.style.margin = '0';
                        card.style.backgroundColor = '#16141c'; // Force hex background
                        card.style.borderColor = '#221f2b'; // Force hex border
                        
                        // Force full text display
                        const p = card.querySelector('p');
                        if (p) {
                            p.style.display = 'block';
                            p.style.webkitLineClamp = 'unset';
                            p.style.color = '#94a3b8'; // Force hex text color
                        }

                        const h3 = card.querySelector('h3');
                        if (h3) {
                            h3.style.color = '#ffffff'; // Force hex title color
                        }
                    }
                }
            };

            const canvas = await html2canvas(cardRef.current, options);
            const image = canvas.toDataURL('image/png', 1.0);
            
            const link = document.createElement('a');
            const fileName = (post.title || "record").replace(/\s+/g, '-').toLowerCase();
            link.download = `UrNotes-${fileName}.png`;
            link.href = image;
            link.click();
            
            toast.success("Record Saved", { id: "export" });
        } catch (error) {
            console.error("Capture Error:", error);
            toast.error("Capture failed. Access restricted.", { id: "export" });
        }
    };

    return (
        <motion.div
            ref={cardRef}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            id={`post-card-${post._id}`}
            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#221f2b] bg-[#16141c] shadow-lg transition-all hover:bg-[#1e1b26] cursor-pointer"
        >
            <div className="p-2 space-y-4">
                {post.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2.2rem] bg-[#0b0a0f]">
                        <img 
                            src={post.image} 
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            crossOrigin="anonymous"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#16141c] to-transparent opacity-60" />
                    </div>
                ) : (
                    <div className="flex aspect-[16/10] items-center justify-center rounded-[2.2rem] bg-[#0b0a0f] border border-[#221f2b]">
                        <ImageIcon size={32} className="text-slate-800" />
                    </div>
                )}

                <div className="px-6 pb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                            <Calendar size={12} className="text-[#a855f7]" />
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'System Date'}
                        </div>
                        <div className="md:hidden text-[#a855f7]">
                            <MoreVertical size={18} />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <h3 className="text-2xl font-black text-white font-outfit line-clamp-1 group-hover:text-[#a855f7] transition-colors uppercase italic tracking-tight">
                            {post.title || "Untitled Entry"}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">
                            {post.description || "No description provided for this record."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Premium Action Overlay - Simplified to a single PNG button */}
            <AnimatePresence>
                {(isMenuOpen || true) && (
                    <motion.div 
                        data-export-hide="true"
                        className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                            isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-2 p-2 rounded-[1.5rem] bg-[#0b0a0f]/90 backdrop-blur-xl border border-[#221f2b] shadow-2xl">
                            <button 
                                onClick={exportAsPNG}
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a855f7] text-white hover:bg-white hover:text-[#a855f7] transition-all active:scale-90 shadow-lg shadow-[#a855f7]/20"
                                title="Download PNG"
                            >
                                <Download size={22} />
                            </button>
                            
                            {isAuthor && (
                                <>
                                    <div className="h-px w-full bg-[#221f2b] my-1" />
                                    <button 
                                        onClick={() => navigate(`/edit-post/${post._id}`)}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-90"
                                        title="Edit"
                                                                            >
                                        <Edit size={20} />
                                    </button>
                                    <button 
                                        onClick={async (e) => {
                                            if (window.confirm('Erase this record form binary?')) {
                                                try {
                                                    await axios.delete(`http://localhost:3000/api/posts/${post._id}`, {
                                                        headers: { Authorization: `Bearer ${user.token}` }
                                                    });
                                                    toast.success('Record purged');
                                                    if (onDelete) onDelete(post._id);
                                                } catch (err) {
                                                    toast.error('Purge failed');
                                                }
                                            }
                                        }}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PostCard;
