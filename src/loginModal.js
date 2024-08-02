import React from 'react';
import Login from './login';

function LoginModal({ onClose }) {
  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <button className="close-modal" onClick={onClose}>×</button>
        <Login onLoginSuccess={onClose}/>
      </div>
    </div>
  );
}

export default LoginModal;