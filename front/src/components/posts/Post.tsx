import React, { useEffect, useState } from "react";
import { IRealEstate, IPost, IUser } from "../../models/models";
import { getUserById } from "../../services/user-service";
import RealEstateService from "../../services/realestate-service";
import { User } from "lucide-react";
import "../../styles/post.css";
import Comments from "../comments/Comments";

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [realEstate, setRealEstate] = useState<IRealEstate | null>(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchUserAndRealEstate = async () => {
      if (post.user) {
        const fetchedUser = await getUserById(post.user);
        setUser(fetchedUser);
      }
      if (post.realestate) {
        const fetchedRealEstate = await RealEstateService.getById(post.realestate);
        setRealEstate(fetchedRealEstate);
      }
    };

    fetchUserAndRealEstate();
  }, [post.user, post.realestate]);

  const username = user?.username || (user?.email ? user.email.split("@")[0] : "Unknown User");
  const imgUrl = user?.imgUrl
  const realEstateImgUrl = realEstate?.picture || "";

  return (
    <div className="post">
      <div className="post-header">
      {imgUrl ? (
          <img src={imgUrl} alt="User" className="user-img" />
        ) : (
          <User className="user-icon" />
        )}
        <span className="username">{username}</span>
      </div>
      
      <div className="real-estate-info">
        {realEstateImgUrl ? (
          <img src={realEstateImgUrl} alt="Real Estate Image" className="real-estate-img" />
        ) : (
          <p>No image available</p>
        )}

        <div className="text-gray-700 space-y-2">
          <p className="text-sm font-semibold"><strong>Location:</strong> {realEstate?.location}, {realEstate?.city}</p>
          <p className="text-sm text-gray-500"><strong>Address:</strong> {realEstate?.address}</p>
          <p className="mt-2 text-gray-600"><strong>Description:</strong> {realEstate?.description}</p>
        </div>
      </div>
      <button className="comment-btn" onClick={() => setShowComments(!showComments)}>
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      <div className={`comments-container ${showComments ? "visible" : ""}`}>
      {showComments && post._id && post.user && <Comments postId={post._id} userId={post.user} />}
    </div>
    </div>
  );
};

export default Post;