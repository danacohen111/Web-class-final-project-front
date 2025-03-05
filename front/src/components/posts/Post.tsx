import React from "react";
import { IPost } from "../../services/post-service";
import "../../styles/post.css";

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const userImgUrl = post.user?.imgUrl || "/default-avatar.png"; // Use a default image if imgUrl is missing
  const username = post.user?.username || "Anonymous"; // Fallback to "Anonymous" if username is missing

  const location = post.realEstate?.location || ""; 
  const city = post.realEstate?.city || "Unknown City";
  const address = post.realEstate?.address || "No Address";
  const description = post.realEstate?.description || "No Description";
  const owner = post.realEstate?.owner || "Unknown Owner";

  return (
    <div className="post">
      <div className="post-header">
        <img src={userImgUrl} alt="User" className="user-img" />
        <span>{username}</span>
      </div>
      <div className="real-estate-info">
        <h3>{city}</h3>
        <p>{address}</p>
        <p>{description}</p>
        <p>Owner: {owner}</p>
        {location && <img src={location} alt="Real Estate" className="real-estate-img" />}
      </div>
    </div>
  );
};

export default Post;
