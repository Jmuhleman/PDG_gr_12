// Modal.js
import React from 'react';
// import './Modal.css'; // Optional: for styling the modal

const Modal = ({ show, children}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
       {children}
      </div>
    </div>
  );
};

export default Modal;