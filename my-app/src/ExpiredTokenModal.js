import React from 'react';

const ExpiredTokenModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Session Expired</h2>
        <p>Your login session has expired. Please log in again to submit your form.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ExpiredTokenModal;