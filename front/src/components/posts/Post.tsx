import React, { useEffect, useState } from "react";
import { IRealEstate, IPost, IUser } from "../../models/models";
import { getUserById } from "../../services/user-service";
import RealEstateService from "../../services/realestate-service";
import { User } from "lucide-react";
import "../../styles/post.css";
import Comments from "../comments/Comments";
import skylineDefault from "../../assets/skyline-default.jpg";

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [realEstate, setRealEstate] = useState<IRealEstate | null>(null);

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
  const imgUrl = user?.imgUrl;
  const realEstateImgUrl = realEstate?.picture || "";

  return (
    <div className="post">
      <div className="post-header">
        {imgUrl ? (
          <img src={imgUrl} alt="User" className="user-img" />
        ) : (
          <User className="user-img" />
        )}
        <span className="username">{username}</span>
      </div>
      
      <div className="real-estate-img">
        {realEstateImgUrl ? (
          <img src={realEstateImgUrl} alt="Real Estate Image" />
        ) : (
          <img src={skylineDefault} alt="Default Image" />
        )}
      </div>
        <div className="description">
          <p className="text-sm font-semibold"><strong>Location:</strong> {realEstate?.location}, {realEstate?.city}</p>
          <p className="text-sm text-gray-500"><strong>Address:</strong> {realEstate?.address}</p>
          <p className="mt-2 text-gray-600"><strong>Description:</strong> {realEstate?.description}</p>
        </div>
      <div className="comments-container visible">
        {post._id && <Comments postId={post._id} />}
      </div>
    </div>
  );
};

export default Post;
