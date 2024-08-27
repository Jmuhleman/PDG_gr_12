import React, { useState } from "react";
import PropTypes from 'prop-types'; 
import './submitForm.css'

function SubmitForm({
  label = "Your Information:",
  placeholder = "Enter some text...",
  buttonText = "Submit",
  onSubmit = () => {}, // Default to an empty function if no handler is provided
}) {
  const [text, setText] = useState(''); // Initialize with an empty string

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(text); // Call the custom submit handler with the current text
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="form-input">{label}</label>
        <input
          id="form-input"
          className="form-input"
          type="text"  // Use <input> for a single line of text, not <form>
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
        />
        <br />
        <button type="submit" className="submit-button">{buttonText}</button>
      </form>
    </div>
  );
}

SubmitForm.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default SubmitForm;