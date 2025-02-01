'use client'
import { createSnippet } from '@/src/db/snippet';
import { useCodeEditorStore } from '@/src/store/useCodeEditor';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import toast from "react-hot-toast";

const ShareSnippetDialog = ({ onClose }: { onClose: () => void }) => {
    const [title, setTitle] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const { language, getCode } = useCodeEditorStore();
    
    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSharing(true);
        const code = getCode();

        try {
            const res = await fetch("/api/createSnippet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    title,
                    language,
                    code,
                })
            });

            const responseData = await res.json();
            onClose();
            setTitle("");
            toast.success("Snippet shared succesfully")
            
        } catch(error) {
            console.log("Error creating snippet:", error);
            toast.error("Error creating snippet");
        } finally {
            setIsSharing(false);
        }

        
    }


  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Share Snippet</h2>
                <button onClick={onClose} className='text-gray-400 hover:text-gray-300'>
                    <X />
                </button>
            </div>

            <form onSubmit={handleShare}>
                <div className='mb-4'>
                    <label htmlFor="title" className='block text-sm font-medium text-gray-400 mb-2'>Title</label>
                    <input 
                        type="text" 
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter snippet title"
                        required
                    />
                </div>

                <div className='flex justify-end gap-3'>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSharing}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                        disabled:opacity-50"
                    >
                        {isSharing ? "Sharing..." : "Share"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ShareSnippetDialog