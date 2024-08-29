import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import SubmitForm from '../../components/SubmitForm';
import AuthButtons from '../../components/AuthButtons';
import { useClient } from '../hooks/useClient';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
  // Form field configurations
  const PlateConfig = [
    { id: 'plate', label: 'Numéro de plaque : ', type: 'text', placeholder: 'VD09815...', className: 'full-width' }
  ];
  
  const LoginConfig = [
    { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', className: 'full-width' },
    { id: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', className: 'full-width' }
  ];
  
  const SignUpConfig = [
    { id: 'name', label: "Nom :", type: 'text', placeholder: '' },
    { id: 'surname', label: "Prénom :", type: 'text', placeholder: '' },
    { id: 'street', label: "Rue :", type: 'text', placeholder: '' },
    { id: 'number', label: "Numéro :", type: 'text', placeholder: '', className: 'small' },
    { id: 'prn', label: "NPA :", type: 'text', placeholder: '', className: 'small' },
    { id: 'town', label: "Ville :", type: 'text', placeholder: '', className: 'fill' },
    { id: 'phone', label: "Numéro de téléphone :", type: 'tel', placeholder: '', className: 'full-width' },
    { id: 'email', label: "Email :", type: 'email', placeholder: '', className: 'full-width' },
    { id: 'password', label: "Mot de passe :", type: 'password', placeholder: '', className: 'full-width' },
    { id: 'confirmation', label: "Confirmer le mot de passe :", type: 'password', placeholder: '', className: 'full-width' },
    { id: 'plate', label: "Numéro de plaque :", type: 'text', placeholder: 'VD09815...', className: 'full-width' }
  ];
  

  // State management for showing forms
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [cookies, setCookie] = useCookies(['client']);
  const { setClient } = useClient();
  const navigate = useNavigate();

  // Initialize cookies and client state
  useEffect(() => {
    setClient({ value: '', haveAccount: false });
    setCookie('client', { value: '', haveAccount: false }, { path: '/' });
  }, [setClient, setCookie]);

  // Handles plate number submission
  const handleSubmit = (formData) => {
    if (!formData.plate) return;
    setCookie(
      'client',
      { value: formData.plate, haveAccount: false },
      { path: '/', expires: new Date(Date.now() + 1000 * 3600 * 24 * 7) }
    );
    navigate('/billing_overview');
  };

  // Navigate back to the home state
  const goHome = () => {
    setShowLogin(false);
    setShowSignUp(false);
  };

  const ReturnButton = (
    <button type="button" onClick={goHome} className="submit-button">
      {"Retour"}
    </button>
  );

  // Toggle form states
  const handleLoginForm = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUpForm = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLogin = (formData) => {
    console.log('Login form submitted:', formData);
    // Add actual login logic here
  };

  const handleSignUp = (formData) => {
    console.log('Sign up form submitted:', formData);
    // Add actual sign-up logic here
  };

  return (
    <div>
      <AuthButtons
        buttonLogInText="Connexion"
        buttonSignUpText="Inscription"
        onLogin={handleLoginForm}
        onSignUp={handleSignUpForm}
      />
      <h1>Welcome to Our Website</h1>
      <p>This is the homepage where you can find an overview of our services and features.</p>

      {!showLogin && !showSignUp && (
        <SubmitForm label="Numéro de plaque : " fieldsConfig={PlateConfig} onSubmit={handleSubmit} />
      )}

      {showLogin && (
        <SubmitForm
          label="Login : "
          fieldsConfig={LoginConfig}
          onSubmit={handleLogin}
          extraButton={ReturnButton}
        />
      )}

      {showSignUp && (
        <SubmitForm
          label="Sign Up: "
          fieldsConfig={SignUpConfig}
          onSubmit={handleSignUp}
          extraButton={ReturnButton}
        />
      )}

      <nav>
        <ul>
          <li>
            <Link to="/billing_overview">Billing Overview</Link>
          </li>
          <li>
            <Link to="/admin">Admin Section</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
