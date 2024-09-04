import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import SubmitForm from '../../components/SubmitForm';
import AuthButtons from '../../components/AuthButtons';
import { useClient } from '../hooks/useClient';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { APIPostRequestWithoutCredentials } from '../../utils/APIRequest';
import { urlAPI } from '../../config';
import { passwordErrorHandler } from '../../utils/PasswordValidation';
import countries from 'i18n-iso-countries';

// Import French locale data
import frLocale from 'i18n-iso-countries/langs/fr.json';

countries.registerLocale(frLocale);




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
    { id: 'lastname', label: "Nom :", type: 'text', placeholder: '' },
    { id: 'firstname', label: "Prénom :", type: 'text', placeholder: '' },
    { id: 'street', label: "Rue :", type: 'text', placeholder: '' },
    { id: 'number', label: "Numéro :", type: 'text', placeholder: '', className: 'small' },
    { id: 'zip', label: "NPA :", type: 'text', placeholder: '', className: 'small' },
    { id: 'town', label: "Ville :", type: 'text', placeholder: '', className: 'fill' },
    {
      id: 'country', label: "Pays :", type: 'select', placeholder: 'le pays', className: 'full-width',
      options: useMemo(() => {
        return Object.entries(countries.getNames("fr", { select: "official" })).map(([value, label]) => ({
          value,
          label
        }));
      }, [])
    },
    { id: 'phone', label: "Numéro de téléphone :", type: 'tel', placeholder: '', className: 'full-width' },
    { id: 'email', label: "Email :", type: 'email', placeholder: '', className: 'full-width' },
    { id: 'password', label: "Mot de passe :", type: 'password', placeholder: '', className: 'full-width' },
    { id: 'confirmation', label: "Confirmer le mot de passe :", type: 'password', placeholder: '', className: 'full-width' },
    { id: 'plate', label: "Numéro de plaque :", type: 'text', placeholder: 'VD09815...', className: 'full-width' }
  ];


  // State management for showing forms
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signInStatus, setSignInStatus] = useState({ code: 0, text: "" });
  const [signUpStatus, setSignUpStatus] = useState({ code: 0, text: "" });
  const [signInData, setSignInData] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(['client']);
  const { setClient } = useClient();
  const [errMsg, setErrMsg] = useState('');
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
    navigate('/billingOverview');
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
    setErrMsg('');
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUpForm = () => {
    setErrMsg('');
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLogin = async ({ email, password }) => {


  if (!isValidEmail(email)) {
    setErrMsg("Adresse email invalide.");
    return;
  }





    const formData = { "email": email, "password": password };
    console.log('Login form submitted:', formData);
    // Add actual login logic here
    await APIPostRequestWithoutCredentials({ url: `${urlAPI}/sign_in`, data: formData, setData: setSignInData, setStatus: setSignInStatus });
  };

  useEffect(() => {
    if (signInStatus.code >= 200 && signInStatus.code < 300) {
      const client = signInData?.id;
      const jwToken = signInData?.jwt; // Assume JWT is part of signInData
      if (jwToken) {
        // Store the JWT in a cookie
        setCookie('access_token', jwToken, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days expiry
          secure: false, // Only sent over HTTPS
          sameSite: 'Strict' // Prevents CSRF
        });
        setClient({ value: client, haveAccount: true });
        setCookie('client', { value: client, haveAccount: true }, { path: '/' });
        navigate('/billingOverview');
      } else {
        console.error('JWT not found in response');
      }
    }
  }, [signInStatus]);

  const isValidPhoneNumber = (input, minDigits, maxDigits) => {
    // Regular expression to match only numbers with an optional leading +, and enforce min and max digits
    const regex = new RegExp(`^\\+?\\d{${minDigits},${maxDigits}}$`);
    return regex.test(input);
  };

  const isValidEmail = (email) => {
    // Regular expression for validating an email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendSignUp = async ({ lastname, firstname, street, number, town, zip, country, phone, email, password, plate }) => {
    const formData = {
      "lastname": lastname,
      "firstname": firstname,
      "address": {
        "street": street,
        "number": number,
        "city": town,
        "zip": zip,
        "country": country
      },
      "phone": phone,
      "email": email,
      "password": password,
      "plate": plate
    }
    console.log('Sign up form submitted:', formData);
    // Add actual sign-up logic here
    await APIPostRequestWithoutCredentials({ url: `${urlAPI}/sign_up`, data: formData, setData: (data) => console.log(data), setStatus: setSignUpStatus });
  };



const handleSignUp = ({ firstname, lastname, street, number, zip, town, country, phone, email, password, confirmation, plate }) => {
 
  setErrMsg(''); 
  if (!passwordErrorHandler(password,confirmation, setErrMsg)){return};

  const minDigitsPhone = 8;
  const maxDigitsPhone = 16;
  if (!isValidPhoneNumber(phone, minDigitsPhone, maxDigitsPhone)) {
    setErrMsg('Numéro de téléphone invalide. Assurez-vous qu\'il est composé de chiffres uniquement et qu\'il a entre 8 et 16 chiffres.');
    return;
  }

  const params = { lastname, firstname, street, town, zip };
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value.length < 2) {
      setErrMsg(`Error ${key} must be at least 2 characters long.`);
      return;
    }
  }

  if (plate.length > 6) {
    setErrMsg("Le numéro de plaque doit contenir moins de 7 caractères.");
    return;
  }

  if (!isValidEmail(email)) {
    setErrMsg("Adresse email invalide.");
    return;
  }

  handleSendSignUp(lastname, firstname, street, number, town, zip, country, phone, email, password, plate);
}

useEffect(() => {
  if (signUpStatus?.code >= 200 && signUpStatus?.code < 300) {
    goHome();
    setShowLogin(true);
  }
}, [signUpStatus]);

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
        message={(signInStatus && (signUpStatus.code < 200 || signUpStatus.code >= 300)) ? signInStatus.text : ''}
        errorMsg={errMsg}
      />
    )}

    {showSignUp && (
      <SubmitForm
        label="Sign Up: "
        fieldsConfig={SignUpConfig}
        onSubmit={handleSignUp}
        extraButton={ReturnButton}
        message={(signUpStatus && (signUpStatus.code < 200 || signUpStatus.code >= 300)) ? signUpStatus.text : ''}
        errorMsg={errMsg}
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
