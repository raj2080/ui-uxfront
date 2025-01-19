import axios from 'axios';

// Constants
const API_BASE_URL = 'http://localhost:5000/api';
const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_ID: 'userId',
    USER: 'user'
};

// Creating backend configuration
const Api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper Functions
const clearStorage = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};

const updateStoredUserData = (userData) => {
    if (!userData) return;
    
    const userToStore = {
        _id: userData._id || userData.id,
        nickname: userData.nickname,
        email: userData.email,
        updatedAt: userData.updatedAt
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));
};

// Request Interceptor
Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
Api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearStorage();
            // Optionally redirect to login page
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API Functions
export const signupApi = async (data) => {
    try {
        const response = await Api.post('users/signup', data);
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const loginApi = async (data) => {
    try {
        const response = await Api.post('users/login', data);
        
        if (response.data?.data) {
            const { user, token } = response.data.data;
            
            localStorage.setItem(STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER_ID, user._id || user.id);
            updateStoredUserData(user);

            console.log('Login successful:', {
                userId: user._id || user.id,
                nickname: user.nickname,
                email: user.email
            });
        } else {
            throw new Error('Invalid response format from server');
        }

        return response;
    } catch (error) {
        clearStorage();
        throw handleApiError(error);
    }
};

export const getUserProfile = async () => {
    try {
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        if (!userId) throw new Error('User ID not found. Please login again.');

        const response = await Api.get(`users/profile/${userId}`);
        
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
        console.log('Updating profile:', {
            token: localStorage.getItem(STORAGE_KEYS.TOKEN),
            userId: localStorage.getItem(STORAGE_KEYS.USER_ID),
            updateData: userData
        });

        const response = await Api.put('users/profile/update', userData);
        
        if (response.data?.success) {
            updateStoredUserData(response.data.user);
        }

        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await Api.put('users/change-password', passwordData);
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

// Utility Functions
export const isLoggedIn = () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    return Boolean(token && userId);
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

export const logout = () => {
    clearStorage();
};

// Error Handler
const handleApiError = (error) => {
    console.error('API Error:', error);
    
    return {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status,
        data: error.response?.data,
        originalError: error
    };
};

// Custom Hooks (if using React)
export const useAuth = () => {
    return {
        isLoggedIn: isLoggedIn(),
        userData: getStoredUserData(),
        logout,
    };
};

export default Api;