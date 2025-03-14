import React, { useEffect, useState } from "react";
import { IComment } from "../../models/models";
import CommentService from "../../services/comment-service";
import { getUserById } from "../../services/user-service"; 
import "../../styles/comments.css";

interface CommentsProps {
  postId: string;
  userId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId, userId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ username: string; imgUrl: string }>({ username: "Unknown", imgUrl: "/default-avatar.png" });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await CommentService.getCommentsByPost(postId);

        const commentsWithUsers = await Promise.all(
          fetchedComments.map(async (comment) => {
            const userDetails = await getUserById(comment.user);
            return {
              ...comment,
              userDetails: userDetails
                ? { username: userDetails.username || userDetails.email?.split("@")[0], imgUrl: userDetails.imgUrl }
                : { username: "Unknown", imgUrl: "/default-avatar.png" },
            };
          })
        );

        setComments(commentsWithUsers);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCurrentUser = async () => {
      try {
        const userDetails = await getUserById();
        setCurrentUser(userDetails
          ? { username: userDetails.username || userDetails.email?.split("@")[0] || "Unknown", imgUrl: userDetails.imgUrl || "/default-avatar.png" }
          : { username: "Unknown", imgUrl: "/default-avatar.png" }
        );
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchComments();
    fetchCurrentUser();
  }, [postId, userId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const commentData = await CommentService.addComment(postId, userId, newComment);

    const userDetails = await getUserById(userId);

    setComments([
      ...comments,
      {
        ...commentData,
        userDetails: userDetails
          ? { username: userDetails.username ?  userDetails.username : (userDetails.email?.split("@")[0] ?? "Unknown"), imgUrl: userDetails.imgUrl }
          : { username: "Unknown", imgUrl: "/default-avatar.png" },
      },
    ]);

    setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="comments-section">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <img src={comment.userDetails?.imgUrl || "/default-avatar.png"} alt="User" />
          <div className="comment-content">
            <span className="comment-username">{comment.userDetails?.username || comment.userDetails?.email?.split("@")[0]}</span>
            <span className="comment-text">{comment.content}</span>
          </div>
        </div>
      ))}

      <div className="add-comment">
        <div className="add-comment-header">
      <img src={currentUser.imgUrl} alt="User" className="user-img" />
      <p className="comment-username">{currentUser?.username || "Unknown"}</p>
      </div>
      <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
    </div>
  );
};

export default Comments;
