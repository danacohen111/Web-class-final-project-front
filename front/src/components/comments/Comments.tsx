import React, { useEffect, useState } from "react";
import { IComment } from "../../models/models";
import CommentService from "../../services/comment-service";
import "../../styles/comments.css";

interface CommentsProps {
  postId: string;
  userId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId, userId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await CommentService.getCommentsByPost(postId);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await CommentService.addComment(postId, userId, newComment);
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="comments-section">
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment.content}</p>
          </div>
        ))
      )}
      <div className="add-comment">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
    </div>
  );
};

export default Comments;
