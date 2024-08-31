import React from 'react';
import PropTypes from 'prop-types';
import './plateButton.css';

const PlateButton = ({ text, value, onClick, isDisabled }) => {

    const handelOnClick = () => {
        onClick(value);
    }

    return (
        <button disabled={isDisabled} className='btn white-btn plate-btn' onClick={handelOnClick}>
            {text}
        </button>
    );
};

PlateButton.propTypes = {
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
};

export default PlateButton;