import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Step 1: Import useNavigate
import { signupApi } from "../../apis/Api";

const Registerpage = () => {
  const [nickname, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypepassword, setRetypePassword] = useState('');

  // States for error messages
  const [nicknameError, setNickNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [retypepasswordError, setRetypePasswordError] = useState('');

  // Step 2: Use useNavigate to create a navigation function
  const navigate = useNavigate();

  const handleNickname = (e) => {
    setNickName(e.target.value);
    setNickNameError('');
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleRetypepassword = (e) => {
    setRetypePassword(e.target.value);
    setRetypePasswordError('');
  };

  const validate = () => {
    let isValid = true;

    if (nickname.trim() === '') {
      setNickNameError("Nickname is Required!");
      isValid = false;
    }

    if (email.trim() === '') {
      setEmailError("Email is Required!");
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError("Password is Required!");
      isValid = false;
    }

    if (retypepassword.trim() === '') {
      setRetypePasswordError("Confirm password is required");
      isValid = false;
    }

    if (retypepassword.trim() !== password.trim()) {
      setRetypePasswordError("Password does not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      console.log('Sending data:', { nickname, email, password, retypepassword });

      const response = await signupApi({ 
        nickname,
        email,
        password,
        retypepassword
      });

      console.log('Response:', response);

      if (response.data.success) {
        alert("User registered successfully!");
        setNickName('');
        setEmail('');
        setPassword('');
        setRetypePassword('');
        
        // Step 3: Redirect to the login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      alert(errorMessage);
    }
  };

  return (
    <div className='container mt-2'>
      <h1>Create an Account!</h1>

      <form className='w-50' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>NickName</label>
          <input 
            type="text" 
            className='form-control'
            value={nickname}
            onChange={handleNickname}
            placeholder='Enter your Nickname'
          />
          {nicknameError && <p className='text-danger'>{nicknameError}</p>}
        </div>

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

        <div className="mb-3">
          <label>Re-type Password</label>
          <input 
            type="password"
            className='form-control'
            value={retypepassword}
            onChange={handleRetypepassword}
            placeholder='Confirm your password'
          />
          {retypepasswordError && <p className='text-danger'>{retypepasswordError}</p>}
        </div>

        <button type="submit" className='btn btn-dark w-100'>
          Create an Account
        </button>
      </form>
    </div>
  );
}

export default Registerpage;