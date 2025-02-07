import { addComment } from "@/src/db/snippet";
import { Comment } from "@/src/types";
import { useUser } from "@clerk/nextjs"
import { useState } from "react";
import toast from "react-hot-toast";


const Comments = ({ snippetId }: { snippetId: string }) => {

  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const getcomments = async () => {
    const res = await fetch(`/api/`)
  };

  const handleSubmitComment = async (content: string) => {
    if (!content.trim()) {
      toast.error("Comment cannt be empty")
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/addComments", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snippetId, content }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const newComment = await res.json();
      setComments([...comments, newComment]);
      toast.success("Comment added!");

    } catch (error) {
      console.log("Error adding comment:", error);
      toast.error("Something went Wrong");

    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`'api/deleteComment/${commentId}`);
      if (!res.ok) throw new Error("Failed to delete comment");

      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted!")
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  }

  return (
    <div>
        Comments
    </div>
  )
}

export default Comments