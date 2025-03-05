import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "../../services/user-service";
import { uploadPhoto } from "../../services/file-service";
import AppMenu from "../menu/appMenu";
import { User as UserIcon } from "lucide-react";
import "./../../styles/profile.css";

const Profile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById();
        setUsername(user.username || "Add username");
        setPreview(user.imgUrl || null);
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
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <AppMenu />
      <div className="profile-content">
        <h2 className="profile-title">Edit Profile</h2>

        {/* Profile Picture */}
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

        {/* File Input */}
        <label className="profile-label">Change Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="profile-input"
        />

        {/* Username Input */}
        <input
          type="text"
          placeholder="Enter new username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="profile-input"
        />

        {/* Update Button */}
        <button
          onClick={handleUpdateProfile}
          className="profile-button"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {/* Success Message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Profile;