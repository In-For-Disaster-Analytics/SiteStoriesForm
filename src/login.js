import React, { useState } from 'react';
import axios from 'axios';
import ConfirmationModal from './confirmationModal';
import { useApp } from './store/AppContext';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { dispatch } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://upstream-dso.tacc.utexas.edu/token', {
        username: username,
        password: password,
        grant_type: 'password'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const jwt = response.data.access_token;
      const jwtExpiration = new Date(new Date().getTime() + 60 * 1000).toISOString();

      dispatch({
        type: 'LOGIN',
        payload: { username, jwt, jwtExpiration }
      });

      localStorage.setItem('jwt', jwt);
      localStorage.setItem('jwt_expiration', jwtExpiration);
      localStorage.setItem('userName', username);

      // Fetch projects data
      const projectsResponse = await axios.get('https://upstream-dso.tacc.utexas.edu/projects', {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      }); 
  
      const uniqueTitles = [...new Set(projectsResponse.data.map(project => project.title))];
      dispatch({
        type: 'SET_PROJECTS',
        payload: uniqueTitles
      });
      
      setPassword('');
      setShowConfirmationModal(true);
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
      
      <ConfirmationModal 
        isOpen={showConfirmationModal} 
        onClose={() => setShowConfirmationModal(false)} 
      />
    </>
  );
};

export default Login;