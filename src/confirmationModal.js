import React, { useState } from 'react';

const ConfirmationModal = ({ isOpen, onClose }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirmation Required</h2>
          <p>"Researcher confirms that IRB Consent protocols followed and completed with participants at the time of interviews or field data collection."</p>
          <label>
            <input 
              type="checkbox" 
              checked={isConfirmed} 
              onChange={(e) => setIsConfirmed(e.target.checked)} 
            /> 
            I confirm
          </label>
          <button onClick={onClose} disabled={!isConfirmed}>OK</button>
        </div>
      </div>
    );
  };


export default ConfirmationModal;