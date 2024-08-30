import React from 'react';
import PropTypes from 'prop-types';
import './inputFields.css'; // Import the CSS for input fields

function InputFields({ formData, handleChange, fieldsConfig }) {
  return (
    <div className="form-field-container">
      {fieldsConfig.map(({ id, label, type, placeholder, className }) => (
        <div key={id} className={`form-field ${className || ''}`}>
          <label htmlFor={id} className="form-label">{label}</label>
          <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={formData[id] || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      ))}
    </div>
  );
}

InputFields.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  fieldsConfig: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string // Optional className for custom styles
  })).isRequired
};

export default InputFields;