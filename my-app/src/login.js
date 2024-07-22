import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const[JWT, setJWT] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tacc.tapis.io/v3/oauth2/tokens', {
        username,
        password,
        grant_type: 'password'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response.data.result.access_token.access_token);
        console.log(response);
        localStorage.setItem('jwt', response.data.result.access_token.access_token);
        localStorage.setItem('jwt_expiration', response.data.result.access_token.expires_at);
        setPassword('');
        setUsername('');    
        
      });
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error
    } finally {
      // Clear form fields
      
    }
    
};

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
  );
};

export default Login;