import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateConfession } from '../../apis/Api';
import './EditConfession.css'; // Ensure the path is correct

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const EditConfession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const confession = location.state.confession;

  const [editContent, setEditContent] = useState({
    content: confession.content,
    title: confession.title,
    category: confession.category,
    imageUrl: confession.imageUrl,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editContent.imageUrl ? `http://localhost:5000/${editContent.imageUrl.replace(/^C:\\uiux development\\backend\\/, '')}` : null);
  const [errors, setErrors] = useState({});

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    } else {
      setErrors((prev) => ({ ...prev, image: 'Invalid file type. Please select a valid image.' }));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setEditContent((prevContent) => ({
      ...prevContent,
      imageUrl: '',
    }));
    document.getElementById('image').value = '';
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        content: editContent.content,
        title: editContent.title,
        category: editContent.category,
      };
      if (selectedFile) {
        formData.image = selectedFile;
      }

      await updateConfession(confession._id, formData);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update confession:', error);
    }
  };

  return (
    <div className="edit-confession-container">
      <div className="confession-form-wrapper">
        <div className="confession-header">
          <h2>Edit Confession</h2>
        </div>
        <form onSubmit={handleEditSubmit} className="confession-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editContent.title}
              onChange={handleEditChange}
              className="edit-input"
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={editContent.content}
              onChange={handleEditChange}
              className="edit-textarea"
              placeholder="Content"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={editContent.category}
              onChange={handleEditChange}
              className="edit-input"
              placeholder="Category"
            />
          </div>
          {/* Image upload */}
          <div className="form-group file-upload-group">
            <label htmlFor="image">
              Add Image (optional)
              <span className="file-info">
                Accepted formats: JPEG, PNG, GIF, WebP (Max: 5MB)
              </span>
            </label>
            <div className="file-input-container">
              <input
                type="file"
                id="image"
                name="image"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                onChange={handleImageChange}
                className={`edit-input-file ${errors.image ? 'error' : ''}`}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="file-remove-btn"
                >
                  Remove Image
                </button>
              )}
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="confession-image-preview" />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">
              Save
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/confessions')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConfession;