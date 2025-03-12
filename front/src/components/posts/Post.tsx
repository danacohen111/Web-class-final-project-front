import React from "react";
import { IPost } from "../../services/post-service";
import "../../styles/post.css";

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="post">
      <div className="post-header">
        <img src={post.sender?.imgUrl || "/default-avatar.png"} alt="User" className="user-img" />
        <span className="username">{post.sender?.username || "Anonymous"}</span>
      </div>
      
      <div className="real-estate-info">
        {post.realEstateDetails?.location ? (
          <img src={post.realEstateDetails?.location} alt="Real Estate" className="real-estate-img" />
        ) : (
          <p>No image available</p>
        )}
        <p>{post.realEstateDetails?.city}</p>
        <p>{post.realEstateDetails?.address}</p>
        <p>{post.realEstateDetails?.description}</p>
      </div>
    </div>
  );
};

export default Post;
