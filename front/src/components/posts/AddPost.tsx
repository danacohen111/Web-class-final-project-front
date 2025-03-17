import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from "../../services/post-service";
import { createRealEstate } from "../../services/realestate-service";
import { uploadPhoto } from "../../services/file-service";
import { IRealEstate, IPost } from "../../models/models";
import "../../styles/AddPost.css";

const AddPostPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    city: '',
    address: '',
    area: '',
    description: '',
    location: '',
    picture: null as File | null
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, picture: event.target.files[0] });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.content) newErrors.content = "Content is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.location) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    try {
      let pictureUrl = '';
      if (formData.picture) {
        pictureUrl = await uploadPhoto(formData.picture);
      }

      const realEstateData: IRealEstate = {
        city: formData.city,
        address: formData.address,
        owner: localStorage.getItem("id") || "",
        description: formData.description,
        area: formData.area,
        location: formData.location,
        picture: pictureUrl
      };
      const realEstate = await createRealEstate(realEstateData);

      if (!realEstate._id) {
        throw new Error("Failed to create real estate entry.");
      }

      const postData: IPost = {
        title: formData.title,
        content: formData.content,
        user: localStorage.getItem("id") || "",
        realestate: realEstate._id
      };
      await createPost(postData);

      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage("Failed to create the post. Please try again.");
    }
  };

  return (
    <div className="add-post-page">
      <div className="add-post-container">
        <h1>Create your real estate profile & Make your dream come true ⚡</h1>
        <form onSubmit={handleSubmit} className="add-post-form">

          <input type="file" accept="image/*" onChange={handlePictureChange} className="file-input" />
          {formData.picture && (
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.picture)} alt="Preview" />
            </div>
          )}

          <div className="post-section">
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
            {errors.title && <span className="error">{errors.title}</span>}

            <input name="content" placeholder="Content" value={formData.content} onChange={handleInputChange} />
            {errors.content && <span className="error">{errors.content}</span>}
          </div>

          <div className="real-estate-section">
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
            {errors.city && <span className="error">{errors.city}</span>}

            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
            {errors.address && <span className="error">{errors.address}</span>}

            <input type="text" name="area" placeholder="Area (m²)" value={formData.area} onChange={handleInputChange} />
            {errors.area && <span className="error">{errors.area}</span>}

            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
            {errors.location && <span className="error">{errors.location}</span>}

            <input type="text" name="description" placeholder="Description of the area" value={formData.description} onChange={handleInputChange} />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <button type="submit">Create My Real Estate</button>
        </form>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AddPostPage;