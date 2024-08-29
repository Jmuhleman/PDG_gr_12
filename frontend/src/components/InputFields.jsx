import React from 'react';
import PropTypes from 'prop-types';

// The InputFields component receives formData, handleChange, and fieldsConfig as props
function InputFields({ formData, handleChange, fieldsConfig }) {
  return (
    <>
      {fieldsConfig.map((field) => (
        <div key={field.id} className="input-group">
          <label htmlFor={field.id}>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              className="form-input"
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
            />
          ) : (
            <input
              id={field.id}
              className="form-input"
              type={field.type}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
    </>
  );
}

InputFields.propTypes = {
  formData: PropTypes.object.isRequired, // formData object containing values of inputs
  handleChange: PropTypes.func.isRequired, // function to handle changes to inputs
  fieldsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default InputFields;