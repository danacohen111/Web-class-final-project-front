import { IRealEstate, IPost, IUser } from "../../models/models";
import { getUserById } from "../../services/user-service";
import RealEstateService from "../../services/realestate-service";
import PostService from "../../services/post-service";
import { User, Pencil, Check, X, Trash, Heart } from "lucide-react";
import "../../styles/post.css";
import Comments from "../comments/Comments";
import skylineDefault from "../../assets/skyline-default.jpg";
import { uploadPhoto } from "../../services/file-service";
import { useState, useEffect } from "react";

interface PostProps {
  post: IPost;
  isInProfilePage: boolean;
  onUpdate: () => void;
  onDelete: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({ post, isInProfilePage, onUpdate, onDelete }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [realEstate, setRealEstate] = useState<IRealEstate | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [editableRealEstate, setEditableRealEstate] = useState<Partial<IRealEstate>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalRealEstateImgUrl, setOriginalRealEstateImgUrl] = useState<string>("");
  const [likes, setLikes] = useState<string[]>(post.userLikes || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRealEstate = async () => {
      try {
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
          setOriginalRealEstateImgUrl(fetchedRealEstate.picture || "");
        }
        const fetchedCurrentUser = await getUserById();
        setCurrentUser(fetchedCurrentUser);
      } catch (error) {
        console.error("Error fetching user and real estate details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndRealEstate();
  }, [post]);

  const username = user?.username || "Unknown User";
  const imgUrl = user?.imgUrl || "";
  const realEstateImgUrl = selectedImage || originalRealEstateImgUrl || skylineDefault;

  const handleEditToggle = () => {
    if (isInEditMode) {
      setEditableRealEstate(realEstate || {});
      setSelectedImage(null);
    } else {
      setSelectedImage(null);
    }
    setIsInEditMode(!isInEditMode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditableRealEstate({ ...editableRealEstate!, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!realEstate || !post.realestate) return;
    let pictureUrl = originalRealEstateImgUrl;
    const fileInput = document.getElementById("picture") as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      pictureUrl = await uploadPhoto(fileInput.files[0]);
    }
    editableRealEstate.picture = pictureUrl;
    try {
      await RealEstateService.updateRealEstate(post.realestate, editableRealEstate!);
      setRealEstate({ ...realEstate, ...editableRealEstate });
      setOriginalRealEstateImgUrl(pictureUrl);
      setIsInEditMode(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleImageClick = () => {
    document.getElementById("picture")?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && isInEditMode) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(post._id!);
      onDelete(post._id!);
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleLike = async () => {
    try {
      const currentUser = await getUserById();
      if (!currentUser) return;

      const hasLiked = likes.includes(currentUser._id!);
      const updatedLikes = hasLiked
        ? likes.filter((id) => id !== currentUser._id)
        : [...likes, currentUser._id!];

      setLikes(updatedLikes);

      const updatedPost: IPost = { ...post, userLikes: updatedLikes };
      await PostService.updatePost(post._id!, updatedPost);
      onUpdate();
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

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
            <>
              <Pencil className="edit-icon" onClick={handleEditToggle} />
              <Trash className="delete-icon" onClick={handleDelete} />
            </>
          )
        )}
      </div>
      <div className="real-estate-img">
        <img
          src={selectedImage || realEstateImgUrl || skylineDefault}
          alt="Real Estate Image"
          onClick={handleImageClick}
          className={isInEditMode ? "clickable" : ""}
        />
        {isInEditMode && (
          <input
            type="file"
            id="picture"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        )}
      </div>

      {!isInEditMode ? (
        <div className="like-container" onClick={handleLike}>
          <Heart className={`heart-icon ${currentUser && currentUser._id && likes.includes(currentUser._id) ? "liked" : ""}`} />
          <span className="likes-count">{likes.length}</span>
        </div>
      ) : (
        <></>
      )}

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
      )}
    </div>
  );
};

export default Post;