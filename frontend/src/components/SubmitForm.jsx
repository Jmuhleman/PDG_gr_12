import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './submitForm.css';
import InputFields from './InputFields'; // Import the InputFields component

function SubmitForm({
  label = 'Your Information:',
  buttonText = 'Submit',
  onSubmit = () => {}, // Default to an empty function if no handler is provided
  fieldsConfig = [] // Default to an empty array if no configuration is provided
}) {
  // Initialize state with an object to manage multiple inputs
  const [formData, setFormData] = useState(
    fieldsConfig.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  );

  // Update state based on input field name
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData); // Call the custom submit handler with the current form data
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>{label}</h2>
        {/* Use the InputFields component and pass necessary props */}
        <InputFields
          formData={formData}
          handleChange={handleChange}
          fieldsConfig={fieldsConfig}
        />
        <button type="submit" className="submit-button">
          {buttonText}
        </button>
      </form>
    </div>
  );
}

SubmitForm.propTypes = {
  label: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  fieldsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
    })
  ),
};

export default SubmitForm;