import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import SubmitForm from '../../components/SubmitForm';
import AuthButtons from '../../components/AuthButtons';  
import { useClient } from '../hooks/useClient';
import { useNavigate } from 'react-router-dom';
import './home.css'

function Home() {
    const PlateConfig = [
        { id: 'plate', label: "Numéro de plaque : ", type: 'text', placeholder: "VD09815..." }
      ];

    const LoginConfig =[ 
        { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
        { id: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }      
    ];

    const SignIn =[

    ];


    const [showModal, setShowModal] = useState(false);
    const {setClient } = useClient();
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(['client']);
    const navigate = useNavigate();
    useEffect(() => {
        setClient({ value: "", haveAccount: false });
        setCookie('client', { value: "", haveAccount: false }, { path: '/' });
    }, []);

    const handleSubmit = (formData) => {
       if(formData.plate === "") return;
        setCookie('client', {value: formData.plate, haveAccount: false }, { path: '/', expires: new Date(Date.now() + 1000*3600*24*7) });
        navigate('/billing_overview');
    };

    const handleLogin = () => { setShowModal(true);
  
        // Add your log in logic here, like showing a log in form or redirecting
      };

      const handleCloseModal = () => {
        setShowModal(false);
      }
    
      // Function to handle the Sign Up button click
    const handleSignUp = () => {
        
     
        // Add your sign up logic here, like showing a sign up form or redirecting
      };

    return (
        <div>
            <AuthButtons
            buttonLogInText="Connexion"
            buttonSignUpText="Inscription"
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            />
            <h1>Welcome to Our Website</h1>
            <p>This is the homepage where you can find an overview of our services and features.</p>
       
            {!showModal && < SubmitForm 
                label="Numéro de plaque : "

                fieldsConfig={PlateConfig}
               
                onSubmit={handleSubmit}
            />}

            {showModal && < SubmitForm 
                label="Login : "
                fieldsConfig={LoginConfig}
                // onSubmit={handleLogin}
            />}
             <nav>
                <ul>
                    <li><Link to="/billing_overview">Billing Overview</Link></li>
                    <li><Link to="/admin">Admin Section</Link></li>
                </ul>
            </nav>
         
     
        </div>
    );
}

export default Home;