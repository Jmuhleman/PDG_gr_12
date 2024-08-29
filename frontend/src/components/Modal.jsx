// Modal.js
import React from 'react';
// import './Modal.css'; // Optional: for styling the modal

const Modal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sign Up</h2>
        <p>This is the Sign Up pop-up content!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;