import React from "react";
import PropTypes from 'prop-types'; 
import './authButtons.css'

function AuthButtons({
    buttonSignUpText = "Sign Up",
    buttonLogInText = "Login",
    onLogin = () => {},
    onSignUp = () => {}
}) {
    return ( 
        <div className="auth-buttons">
            {/* Log In Button */}
            <button className="btn login-btn" onClick={onLogin}>{buttonLogInText}</button>
            {/* Sign Up Button */}
            <button className="btn signup-btn" onClick={onSignUp}>{buttonSignUpText}</button>
        </div>
    );
}

AuthButtons.propTypes = {
    buttonSignUpText: PropTypes.string,
    buttonLogInText: PropTypes.string,
    onLogin: PropTypes.func,
    onSignUp: PropTypes.func
};

export default AuthButtons;