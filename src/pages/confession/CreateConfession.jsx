// src/pages/confession/CreateConfession.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createConfession } from '../../apis/Api';
import './CreateConfession.css';

// Helper function for consistent datetime format (UTC)
const getCurrentDateTime = () => {
    const now = new Date();
    
    // Get UTC components
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');  // Add 1 because months are 0-based
    const day = String(now.getUTCDate()).padStart(2, '0');
    
    // Return formatted datetime string
    return `${year}-${month}-${day}`;
};

// Helper function to get user from localStorage
const getCurrentUser = () => {
    try {
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);
        return user.nickname ;
    } catch (error) {
        console.error('Error getting current user:', error);
        
    }
};

const CreateConfession = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Personal',
        image: null,
        author: getCurrentUser(),
        timestamp: getCurrentDateTime()
    });

    const [errors, setErrors] = useState({
        title: '',
        content: '',
        category: '',
        image: ''
    });

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Constants
    const MAX_TITLE_LENGTH = 100;
    const MIN_TITLE_LENGTH = 5;
    const MAX_CONTENT_LENGTH = 5000;
    const MIN_CONTENT_LENGTH = 10;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const categories = [
        'Personal',
        'Relationship',
        'Work',
        'Family',
        'School',
        'Other'
    ];

    // Check authentication and debug logging
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { 
                state: { from: '/create-confession' }
            });
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('CreateConfession component mounted');
            console.log('Current User:', getCurrentUser());
            console.log('Current DateTime:', getCurrentDateTime());
        }
    }, [navigate]);

    // Validation functions
    const validateTitle = (title) => {
        if (!title.trim()) {
            return 'Title is required';
        }
        if (title.trim().length < MIN_TITLE_LENGTH) {
            return `Title must be at least ${MIN_TITLE_LENGTH} characters`;
        }
        if (title.length > MAX_TITLE_LENGTH) {
            return `Title cannot exceed ${MAX_TITLE_LENGTH} characters`;
        }
        if (!/^[a-zA-Z0-9\s.,!?-]+$/.test(title)) {
            return 'Title contains invalid characters';
        }
        return '';
    };

    const validateContent = (content) => {
        if (!content.trim()) {
            return 'Content is required';
        }
        if (content.trim().length < MIN_CONTENT_LENGTH) {
            return `Content must be at least ${MIN_CONTENT_LENGTH} characters`;
        }
        if (content.length > MAX_CONTENT_LENGTH) {
            return `Content cannot exceed ${MAX_CONTENT_LENGTH} characters`;
        }
        return '';
    };

    const validateCategory = (category) => {
        if (!categories.includes(category)) {
            return 'Please select a valid category';
        }
        return '';
    };

    const validateImage = (file) => {
        if (file) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                return 'Invalid image format. Please use JPEG, PNG, GIF, or WebP';
            }
            if (file.size > MAX_IMAGE_SIZE) {
                return 'Image size should be less than 5MB';
            }
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation
        let error = '';
        switch (name) {
            case 'title':
                error = validateTitle(value);
                break;
            case 'content':
                error = validateContent(value);
                break;
            case 'category':
                error = validateCategory(value);
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageError = validateImage(file);
        if (imageError) {
            toast.error(imageError);
            e.target.value = '';
            return;
        }

        setFormData(prev => ({ ...prev, image: file }));
        setErrors(prev => ({ ...prev, image: '' }));
        
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {
            title: validateTitle(formData.title),
            content: validateContent(formData.content),
            category: validateCategory(formData.category),
            image: validateImage(formData.image)
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            const errorMessages = Object.values(errors).filter(error => error !== '');
            errorMessages.forEach(error => toast.error(error));
            return;
        }

        setLoading(true);

        try {
            const response = await createConfession({
                ...formData,
                title: formData.title.trim(),
                content: formData.content.trim(),
                author: getCurrentUser(),
                timestamp: getCurrentDateTime()
            });

            if (response.data?.success) {
                toast.success('Confession created successfully!');
                navigate('/');
            } else {
                throw new Error(response.data?.message || 'Failed to create confession');
            }
        } catch (error) {
            console.error('Error creating confession:', error);
            toast.error(error.message || 'Failed to create confession');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        const confirmReset = window.confirm('Are you sure you want to reset the form? All entered data will be lost.');
        if (confirmReset) {
            setFormData({
                title: '',
                content: '',
                category: 'Personal',
                image: null,
                author: getCurrentUser(),
                timestamp: getCurrentDateTime()
            });
            setErrors({
                title: '',
                content: '',
                category: '',
                image: ''
            });
            setImagePreview(null);
            if (document.getElementById('image')) {
                document.getElementById('image').value = '';
            }
        }
    };

    return (
        <div className="create-confession-container">
            <div className="confession-form-wrapper">
                <div className="confession-header">
                    <h2>Share Your Confession</h2>
                    <p>Express yourself freely and securely</p>
                </div>
                
                <form onSubmit={handleSubmit} className="confession-form">
                    {/* Form groups remain the same */}
                    {/* Title input */}
                    <div className="form-group">
                        <label htmlFor="title">
                            Title 
                            <span className={`character-count ${
                                formData.title.length > MAX_TITLE_LENGTH * 0.9 ? 'near-limit' : ''
                            }`}>
                                {formData.title.length}/{MAX_TITLE_LENGTH}
                            </span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            maxLength={MAX_TITLE_LENGTH}
                            placeholder="Give your confession a title"
                            className={`form-input ${errors.title ? 'error' : ''}`}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    {/* Content textarea */}
                    <div className="form-group">
                        <label htmlFor="content">
                            Your Confession
                            <span className={`character-count ${
                                formData.content.length > MAX_CONTENT_LENGTH * 0.9 ? 'near-limit' : ''
                            }`}>
                                {formData.content.length}/{MAX_CONTENT_LENGTH}
                            </span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            maxLength={MAX_CONTENT_LENGTH}
                            placeholder="Share your thoughts..."
                            className={`form-textarea ${errors.content ? 'error' : ''}`}
                            rows="6"
                        />
                        {errors.content && <span className="error-message">{errors.content}</span>}
                    </div>

                    {/* Category select */}
                    <div className="form-group">
                        <label htmlFor="category">Select Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className={`form-select ${errors.category ? 'error' : ''}`}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
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
                                className={`form-input-file ${errors.image ? 'error' : ''}`}
                            />
                            {formData.image && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setImagePreview(null);
                                        setFormData(prev => ({ ...prev, image: null }));
                                        document.getElementById('image').value = '';
                                        setErrors(prev => ({ ...prev, image: '' }));
                                    }}
                                    className="file-remove-btn"
                                >
                                    <i className="fas fa-times"></i>
                                    Remove
                                </button>
                            )}
                        </div>
                        {errors.image && <span className="error-message">{errors.image}</span>}
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}
                    </div>

                    {/* Form actions */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className={`submit-button ${loading ? 'loading' : ''}`}
                            disabled={loading || Object.values(errors).some(error => error !== '')}
                        >
                            {loading ? 'Creating...' : 'Share Confession'}
                        </button>
                        
                        <button
                            type="button"
                            className="reset-button"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Reset Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateConfession;