import { useAuth } from '@clerk/nextjs'
import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const StarButton = ({snippetId}: { snippetId: string}) => {
    const {isSignedIn} = useAuth();
    const [isStarred, setIsStarred] = useState(false)
    const [starCount, setStarCount] = useState(0);

    const fetchIsStarred = async () => {
      try {
        const res = await fetch(`/api/isSnippetStarred/${snippetId}`);
        const data = await res.json();
        setIsStarred(data.isStarred);
      } catch (error) {
        console.error("Error fetching starred status:", error);
      }
    };

    const fetchStarCount = async () => {
      try {
        const res = await fetch(`/api/getSnippetStarCount/${snippetId}`);
        const data = await res.json();
        setStarCount(data.starCount);
      } catch (error) {
        console.error("Error fetching star count:", error);
      }
    };

    useEffect(() => {
      if (!isSignedIn) return;

      const Interval = setInterval(()=> {
        fetchIsStarred();
        fetchStarCount();
      }, 10000);

      return () => clearInterval(Interval)
    }, [snippetId, isSignedIn])


      const handleStar = async () => {
        if (!isSignedIn) return;
        try {
          const res = await fetch(`/api/starSnippet/${snippetId}`);

          if (!res.ok) {
            throw new Error("Failed to toggle star");
          }
          const data =await res.json();
          setIsStarred(data.isStarred)
          setStarCount((prev) => (data.isStarred ? prev + 1 : prev - 1)); 
        } catch (error) {
          console.log("Error toggling star:", error)
        }
      } 



  return (
    <button
    className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
  transition-all duration-200 ${
    isStarred
      ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
  }`}
    onClick={handleStar}
  >
    <Star
      className={`w-4 h-4 ${isStarred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"}`}
    />
    <span className={`text-xs font-medium ${isStarred ? "text-yellow-500" : "text-gray-400"}`}>
      {starCount}
    </span>
  </button>
  )
}

export default StarButton