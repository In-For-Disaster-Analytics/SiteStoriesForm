import React, { useState } from 'react';
import axios from 'axios';
import ConfirmationModal from './confirmationModal';

const Login = ({onLoginSuccess, setUsername}) => {
  const [username, setUsernameLocal] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  // const[JWT, setJWT] = useState('');
  let response = null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      response = await axios.post('https://tacc.tapis.io/v3/oauth2/tokens', {
        username,
        password,
        grant_type: 'password'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      localStorage.setItem('jwt', response.data.result.access_token.access_token);
      localStorage.setItem('jwt_expiration', response.data.result.access_token.expires_at);
      localStorage.setItem('userName', username);
      setPassword('');
      setUsernameLocal('')
      setUsername(setUsername);
      
      // Show the confirmation modal
      setShowConfirmationModal(true);
      // Close the login modal
      onLoginSuccess();
      
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error
    }
  };
    

  
  return (
    <>
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsernameLocal(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <ConfirmationModal 
      isOpen={showConfirmationModal} 
      onClose={() => setShowConfirmationModal(false)} 
    />
  </>
  );
};

export default Login;