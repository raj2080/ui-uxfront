// src/apis/Api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Constants
const API_BASE_URL = 'http://localhost:5000/api';
const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_ID: 'userId',
    USER: 'user',
    REFRESH_TOKEN: 'refreshToken',
    LAST_ACTIVE: 'lastActive'
};

// Helper Functions for Dynamic Date and User
const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
};

const getCurrentUser = () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return 'anonymous';
    const user = JSON.parse(userData);
    return user.nickname || 'anonymous';
};

// API Instance Configuration
const Api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Helper Functions
const clearStorage = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    sessionStorage.clear();
};

const updateStoredUserData = (userData) => {
    if (!userData) return;
    
    const userToStore = {
        _id: userData._id || userData.id,
        nickname: userData.nickname,
        email: userData.email,
        updatedAt: userData.updatedAt,
        lastActive: getCurrentDateTime()
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, getCurrentDateTime());
};

// Request Interceptor
Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.metadata = { 
            startTime: new Date(),
            requestId: Math.random().toString(36).substring(7)
        };

        if (process.env.NODE_ENV === 'development') {
            console.log('API Request:', {
                url: config.url,
                method: config.method,
                requestId: config.metadata.requestId,
                headers: config.headers
            });
        }

        return config;
    },
    (error) => Promise.reject(handleApiError(error))
);

// Response Interceptor
Api.interceptors.response.use(
    (response) => {
        const requestStartTime = response.config.metadata.startTime;
        response.duration = new Date() - requestStartTime;

        if (process.env.NODE_ENV === 'development') {
            console.log('API Response:', {
                url: response.config.url,
                status: response.status,
                duration: response.duration,
                requestId: response.config.metadata.requestId
            });
        }

        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            clearStorage();
            window.location.href = '/login';
        }
        return Promise.reject(handleApiError(error));
    }
);

// Auth API Functions
export const signupApi = async (data) => {
    try {
        const response = await Api.post('/users/signup', data);
        toast.success('Registration successful! Please log in.');
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const loginApi = async (data) => {
    try {
        const response = await Api.post('/users/login', data);
        
        if (response.data?.data) {
            const { user, token } = response.data.data;
            
            localStorage.setItem(STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER_ID, user._id || user.id);
            updateStoredUserData(user);

            toast.success(`Welcome back, ${user.nickname}!`);
        }
        return response;
    } catch (error) {
        clearStorage();
        throw handleApiError(error);
    }
};

// Profile API Functions
export const getUserProfile = async () => {
    try {
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        if (!userId) throw new Error('User ID not found. Please login again.');

        const response = await Api.get(`/users/profile/${userId}`);
        if (response.data?.data) {
            updateStoredUserData(response.data.data);
        }
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await Api.put('/users/profile/update', userData);
        if (response.data?.success) {
            updateStoredUserData(response.data.user);
            toast.success('Profile updated successfully!');
        }
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await Api.put('/users/change-password', passwordData);
        if (response.data?.success) {
            toast.success('Password changed successfully!');
        }
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Confession API Functions
export const createConfession = async (confessionData) => {
    try {
        // Validate required fields
        const requiredFields = ['title', 'content', 'category'];
        for (const field of requiredFields) {
            if (!confessionData[field]) {
                throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            }
        }

        const formData = new FormData();
        
        // Add current user and timestamp dynamically
        const currentData = {
            ...confessionData,
            author: getCurrentUser(),
            timestamp: getCurrentDateTime()
        };

        // Append text data
        Object.keys(currentData).forEach(key => {
            if (key !== 'image') {
                formData.append(key, currentData[key]);
            }
        });
        
        if (confessionData.image) {
            formData.append('image', confessionData.image);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('Creating confession:', {
                ...currentData,
                image: confessionData.image ? 'Image file present' : 'No image'
            });
        }

        const response = await Api.post('users/confessions/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response;
    } catch (error) {
        console.error('Error in createConfession:', error);
        throw handleApiError(error);
    }
};

export const getAllConfessions = async (page = 1, limit = 10) => {
    try {
        const response = await Api.get(`/confessions/all?page=${page}&limit=${limit}`);
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getUserConfessions = async () => {
    try {
        const response = await Api.get('/confessions/my');
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updateConfession = async (id, confessionData) => {
    try {
        const formData = new FormData();
        
        const currentData = {
            ...confessionData,
            updatedAt: getCurrentDateTime()
        };

        Object.keys(currentData).forEach(key => {
            if (key !== 'image') {
                formData.append(key, currentData[key]);
            }
        });
        
        if (confessionData.image) {
            formData.append('image', confessionData.image);
        }

        const response = await Api.put(`/confessions/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data?.success) {
            toast.success('Confession updated successfully!');
        }

        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deleteConfession = async (id) => {
    try {
        const response = await Api.delete(`/confessions/${id}`);
        if (response.data?.success) {
            toast.success('Confession deleted successfully!');
        }
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Utility Functions
export const isLoggedIn = () => {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);

        if (!token || !userId) return false;

        if (lastActive) {
            const lastActiveTime = new Date(lastActive).getTime();
            const currentTime = new Date().getTime();
            const sessionDuration = currentTime - lastActiveTime;
            
            if (sessionDuration > 24 * 60 * 60 * 1000) {
                clearStorage();
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
};

export const getStoredUserData = () => {
    try {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error parsing stored user data:', error);
        return null;
    }
};

// Error Handler
const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', {
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });
    }

    toast.error(errorMessage);
    
    return {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        originalError: error
    };
};

export const logout = () => {
    try {
        Api.post('/users/logout').finally(() => {
            clearStorage();
            window.location.href = '/login';
        });
    } catch (error) {
        console.error('Logout error:', error);
        clearStorage();
        window.location.href = '/login';
    }
};

export default Api;