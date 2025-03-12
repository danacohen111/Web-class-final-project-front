import React from "react";
import { IPost } from "../../services/post-service";
import "../../styles/post.css";

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const userImgUrl = post.user?.imgUrl || "/default-avatar.png"; 
  const username = post.user?.username || "Anonymous"; 

  const realEstate = post.realEstate || {}; 
  const { location, city = "Unknown City", address = "No Address", description = "No Description", owner = "Unknown Owner" } = realEstate;

  return (
    <div className="post">
      <div className="post-header">
        <img src={userImgUrl} alt="User" className="user-img" />
        <span className="username">{username}</span>
      </div>
      <div className="real-estate-info">
        <h3>{city}</h3>
        <p>{address}</p>
        <p>{description}</p>
        <p>Owner: {owner}</p>
        {location ? (
          <img src={location} alt="Real Estate" className="real-estate-img" />
        ) : (
          <p>No image available</p> 
        )}
      </div>
    </div>
  );
};

export default Post;
