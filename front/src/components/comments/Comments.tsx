import React, { useEffect, useState } from "react";
import { IComment } from "../../models/models";
import CommentService from "../../services/comment-service";
import { getUserById } from "../../services/user-service"; 
import { User } from "lucide-react"; 
import "../../styles/comments.css";

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
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
                ? { username: userDetails.username, imgUrl: userDetails.imgUrl }
                : { username: "Unknown", imgUrl: "" },
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
          ? { username: userDetails.username || "Unknown", imgUrl: userDetails.imgUrl || "" }
          : { username: "Unknown", imgUrl: "" }
        );
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const userDetails = await getUserById();
      const commentData = await CommentService.addComment(postId, userDetails._id!, newComment);

    setComments([
      ...comments,
      {
        ...commentData,
        userDetails: userDetails
          ? { username: userDetails.username ?  userDetails.username : "Unknown", imgUrl: userDetails.imgUrl }
          : { username: "Unknown", imgUrl: "" },
      },
    ]);

    setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="comments-section">
        <div className="scrollable-comments">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              {comment.userDetails?.imgUrl ? (
                <img src={comment.userDetails.imgUrl} alt="User" />
              ) : (
                <User size={24} />
              )}
              <div className="comment-content">
                <span className="comment-username">{comment.userDetails?.username}</span>
                <span className="comment-text">{comment.content}</span>
              </div>
            </div>
          ))}
        </div>
      <div className="add-comment">
        <div className="add-comment-header">
          {currentUser.imgUrl ? (
            <img src={currentUser.imgUrl} alt="User" className="user-img" />
          ) : (
            <User size={24} />
          )}
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