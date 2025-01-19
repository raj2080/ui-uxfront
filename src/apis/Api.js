import axios from 'axios';

// Creating backend configuration
const Api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include token in all requests
Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signupApi = (data) => Api.post('users/signup', data);

// Modified login API function to properly handle user data
export const loginApi = async (data) => {
    try {
        const response = await Api.post('users/login', data);
        
        // Check if we have a successful response with user data
        if (response.data && response.data.data) {
            const { user, token } = response.data.data;
            
            // Store token
            localStorage.setItem('token', token);
            
            // Store user ID from the response
            if (user._id) {
                localStorage.setItem('userId', user._id);
            } else if (user.id) {
                localStorage.setItem('userId', user.id);
            }

            // Store complete user data
            localStorage.setItem('user', JSON.stringify({
                _id: user._id || user.id,
                nickname: user.nickname,
                email: user.email
            }));

            console.log('Stored user data:', {
                userId: user._id || user.id,
                nickname: user.nickname,
                email: user.email
            });
        } else {
            throw new Error('Invalid response format from server');
        }

        return response;
    } catch (error) {
        console.error('Login error:', error);
        // Clear any partial data on error
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        throw error;
    }
};

// Modified get user profile function to handle cases where userId might not be provided
export const getUserProfile = async () => {
    try {
        // Get userId from localStorage
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            throw new Error('User ID not found. Please login again.');
        }

        const response = await Api.get(`users/profile/${userId}`);
        
        // Update stored user data with any new information
        if (response.data && response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // If we get a 401 error, clear the stored data and force re-login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
        }
        
        throw error;
    }
};

// In your Api.js, add a debug log to check the token and userId
export const updateUserProfile = async (userData) => {
    try {
        // Debug logs
        console.log('Stored token:', localStorage.getItem('token'));
        console.log('Stored userId:', localStorage.getItem('userId'));
        console.log('Update data being sent:', userData);

        const response = await Api.put('users/profile/update', userData);
        
        if (response.data && response.data.success) {
            const updatedUser = response.data.user;
            
            // Update stored user data with new information
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUserData = {
                ...currentUser,
                nickname: updatedUser.nickname,
                email: updatedUser.email,
                updatedAt: updatedUser.updatedAt
            };
            
            localStorage.setItem('user', JSON.stringify(newUserData));
        }

        return response;
    } catch (error) {
        console.error('Profile update error details:', {
            message: error.response?.data?.message,
            status: error.response?.status,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
        }
        
        throw {
            message: error.response?.data?.message || 'Failed to update profile',
            status: error.response?.status,
            data: error.response?.data
        };
    }
};

// Utility function to check if user is logged in
export const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
};

// Utility function to get stored user data
export const getStoredUserData = () => {
    try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error parsing stored user data:', error);
        return null;
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
};

export default Api;