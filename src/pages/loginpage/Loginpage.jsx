import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from "../../apis/Api";
import './Loginpage.css';

const Loginpage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // States for error messages
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Use useNavigate to create a navigation function
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const validate = () => {
    let isValid = true;

    if (email.trim() === '') {
      setEmailError("Email is Required!");
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError("Password is Required!");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await loginApi({ email, password });

      if (response.data.success) {
        // Store the JWT token in local storage or cookies
        localStorage.setItem('token', response.data.data.token);

        // Optionally, store user data in local storage or state
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        // Update authentication status
        onLogin();

        // Redirect to the homepage after successful login
        navigate('/');
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error.response?.data?.message || "Login failed";
      alert(errorMessage);
    }
  };

  return (
    <div className='container mt-2'>
      <h1>Welcome Back</h1>

      <form className='w-50' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input 
            type="email"
            className='form-control'
            value={email}
            onChange={handleEmail}
            placeholder='Enter your Email'
          />
          {emailError && <p className='text-danger'>{emailError}</p>}
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input 
            type="password"
            className='form-control'
            value={password}
            onChange={handlePassword}
            placeholder='Enter your Password'
          />
          {passwordError && <p className='text-danger'>{passwordError}</p>}
        </div>

        <button type="submit" className='btn btn-dark w-100'>
          Login
        </button>
      </form>
    </div>
  );
};

export default Loginpage;




