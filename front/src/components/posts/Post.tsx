import React, { useEffect, useState } from "react";
import { IRealEstate, IPost, IUser } from "../../models/models";
import { getUserById } from "../../services/user-service";
import RealEstateService from "../../services/realestate-service";
import { User, Pencil, Check, X } from "lucide-react";
import "../../styles/post.css";
import Comments from "../comments/Comments";
import skylineDefault from "../../assets/skyline-default.jpg";

interface PostProps {
  post: IPost;
  isInProfilePage: boolean;
}

const Post: React.FC<PostProps> = ({ post, isInProfilePage }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [realEstate, setRealEstate] = useState<IRealEstate | null>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [editableRealEstate, setEditableRealEstate] = useState<Partial<IRealEstate>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndRealEstate = async () => {
      if (post.user) {
        const fetchedUser = await getUserById(post.user);
        setUser(fetchedUser);
      }
      if (post.realestate) {
        const fetchedRealEstate = await RealEstateService.getById(post.realestate);
        setRealEstate(fetchedRealEstate);
        setEditableRealEstate({
          ...fetchedRealEstate,
          location: fetchedRealEstate.location,
          city: fetchedRealEstate.city,
          address: fetchedRealEstate.address,
          description: fetchedRealEstate.description,
        });
      }
    };

    fetchUserAndRealEstate();
  }, [post.user, post.realestate]);

  const username = user?.username || (user?.email ? user.email.split("@")[0] : "Unknown User");
  const imgUrl = user?.imgUrl;
  const realEstateImgUrl = realEstate?.picture || "";
  const handleEditToggle = () => setIsInEditMode(!isInEditMode);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditableRealEstate({ ...editableRealEstate!, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!realEstate || !post.realestate) return;

    setLoading(true);
    try {
      await RealEstateService.updateRealEstate(post.realestate, editableRealEstate!);
      setRealEstate({ ...realEstate, ...editableRealEstate });
      setIsInEditMode(false);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        {imgUrl ? (
          <img src={imgUrl} alt="User" className="user-img" />
        ) : (
          <User className="user-img" />
        )}
        <span className="username">{username}</span>
        {isInProfilePage && (
          isInEditMode ? (
            <div>
              <Check className="save-icon" onClick={handleUpdate} />
              <X className="cancel-icon" onClick={handleEditToggle} />
            </div>
          ) : (
            <Pencil className="edit-icon" onClick={handleEditToggle} />
          )
        )}      
      </div>
      
      <div className="real-estate-img">
        {realEstateImgUrl ? (
          <img src={realEstateImgUrl} alt="Real Estate Image" />
        ) : (
          <img src={skylineDefault} alt="Default Image" />
        )}
      </div>
      <div className="description">
        {isInEditMode ? (
          <>
            <p><strong>Location:</strong> 
            <input className="post-input" name="location" value={editableRealEstate?.location} onChange={handleChange} /> </p>
            <p><strong>City:</strong>
            <input className="post-input" name="city" value={editableRealEstate?.city} onChange={handleChange} /> </p>
            <p><strong>Address:</strong>
            <input className="post-input" name="address" value={editableRealEstate?.address} onChange={handleChange} /> </p>
            <p><strong>Description:</strong>
            <textarea className="post-input description" name="description" value={editableRealEstate?.description} onChange={handleChange} /> </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold"><strong>Location:</strong> {realEstate?.location}, {realEstate?.city}</p>
            <p className="text-sm text-gray-500"><strong>Address:</strong> {realEstate?.address}</p>
            <p className="mt-2 text-gray-600"><strong>Description:</strong> {realEstate?.description}</p>
          </>
        )}
      </div>

      {!isInEditMode ? (
            <div className="comments-container visible">
              {post._id && <Comments postId={post._id} />}
            </div>
          ) : (
            <div></div>
          )
        }
    </div>
  );
};

export default Post;
