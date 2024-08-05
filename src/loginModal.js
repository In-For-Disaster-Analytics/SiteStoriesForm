import React from 'react';
import Login from './login';

function LoginModal({ onClose, setUsername }) {
  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <button className="close-modal" onClick={onClose}  >×</button>
        <Login onLoginSuccess={onClose} setUsername={setUsername}/>
      </div>
    </div>
  );
}

export default LoginModal;