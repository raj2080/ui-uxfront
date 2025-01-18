import axios from 'axios';

// Creating backend configuration
const Api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const signupApi = (data) => Api.post('users/signup', data);

export const loginApi = (data) => Api.post('users/login', data); 