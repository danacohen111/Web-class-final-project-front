import React, {useState} from "react";
import { IPost } from "../../services/post-service";
import "../../styles/post.css";
import Comments from "../comments/Comments";

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="post">
      <div className="post-header">
        <img src={post.sender?.imgUrl || "/default-avatar.png"} alt="User" className="user-img" />
        <span className="username">{post.sender?.username || post.user.email.split("@")[0]}</span>
      </div>
      
      <div className="real-estate-info">
        {post.realestate?.imgUrl ? (
          <img src={post.realestate?.imgUrl} alt="Real Estate Image" className="real-estate-img" />
        ) : (
          <p>No image available</p>
        )}

        <div className="text-gray-700 space-y-2">
        <p className="text-sm font-semibold"><strong>Location:</strong> {post.realEstateDetails?.location}, {post.realEstateDetails?.city}</p>
        <p className="text-sm text-gray-500"><strong>Address:</strong> {post.realEstateDetails?.address}</p>
        <p className="mt-2 text-gray-600"><strong>Description:</strong> {post.realEstateDetails?.description}</p>
      </div>
      </div>

      <button className="toggle-comments" onClick={() => setShowComments(!showComments)}>
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      {showComments && <Comments postId={post._id} userId={post.user} />}
    </div>
  );
};

export default Post;
