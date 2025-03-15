import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "../../services/user-service";
import { uploadPhoto } from "../../services/file-service";
import PostService from "../../services/post-service";
import AppMenu from "../menu/appMenu";
import PostList from "../posts/PostList";
import { User as UserIcon } from "lucide-react";
import "./../../styles/profile.css";

const Profile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [originalUsername, setOriginalUsername] = useState("");
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);

  const [hasUsernameChanged, setHasUsernameChanged] = useState(false);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById();
        setUsername(user.username || "");
        setEmail(user.email || "");
        setPreview(user.imgUrl || null);
        setOriginalUsername(user.username || "");
        setOriginalPreview(user.imgUrl || null);
        setUserId(user._id || localStorage.getItem("id"));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setHasImageChanged(true);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setHasUsernameChanged(true);
  };

  const handleUpdateProfile = async () => {
    if (!hasUsernameChanged && !hasImageChanged) {
      setErrorMessage("Please enter a new username or select a new image.");
      return;
    }

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadPhoto(image);
      }

      const formData = new FormData();
      formData.append("username", username);
      if (imageUrl) formData.append("image", imageUrl);

      await updateUser(formData);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setOriginalUsername(username);
      setOriginalPreview(imageUrl || preview);
      setHasUsernameChanged(false);
      setHasImageChanged(false);
    } catch (error) {
      setErrorMessage("Couldn't update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setImage(null);
    setPreview(originalPreview);
    setUsername(originalUsername);
    setHasUsernameChanged(false);
    setHasImageChanged(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const displayName = isEditing ? username : (originalUsername || email.split('@')[0] || "My Profile");

  const isUpdateDisabled = !hasUsernameChanged && !hasImageChanged;

  const fetchUserPosts = async () => {
    if (userId) {
      return await PostService.getPostsByUser(userId);
    }
    return [];
  };

  return (
    <div className={`profile-container ${isEditing ? 'editing' : ''}`}>
      <AppMenu />
      <div className="profile-content">
        <h2 className="profile-title">{displayName}</h2>

        <div className="profile-picture">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="profile-img"
            />
          ) : (
            <UserIcon size={150} color="#ccc" />
          )}
        </div>

        {!isEditing && (
          <button
            onClick={handleEditProfile}
            className="profile-button"
          >
            Edit Profile
          </button>
        )}

        {isEditing && (
          <>
            <label className="profile-label">Change Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="profile-input"
            />

            <input
              type="text"
              placeholder="Enter new username"
              value={username}
              onChange={handleUsernameChange}
              className="profile-input"
            />

            <button
              onClick={handleUpdateProfile}
              className={`profile-button ${isUpdateDisabled ? 'disabled' : ''}`}
              disabled={loading || isUpdateDisabled}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <button
              onClick={handleCancelEdit}
              className="profile-button cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
          </>
        )}

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {!isEditing && (
        <div className="user-posts">
          <h3 className="posts-title">Your Posts</h3>
          <PostList fetchPosts={fetchUserPosts} isInProfilePage={true}/>
        </div>
      )}
    </div>
  );
};

export default Profile;