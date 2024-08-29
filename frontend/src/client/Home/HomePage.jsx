import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import SubmitForm from '../../components/SubmitForm';
import AuthButtons from '../../components/AuthButtons';  
import Modal from '../../components/Modal';
import { useClient } from '../hooks/useClient';
import { useNavigate } from 'react-router-dom';
import './home.css'


function Home() {
    const PlateConfig = [
        { id: 'plate', label: "Numéro de plaque : ", type: 'text', placeholder: "VD09815..." },
      ];


    const [showModal, setShowModal] = useState(false);
    const {setClient } = useClient();
    const navigate = useNavigate();
    useEffect(() => {
        setClient({ value: "", haveAccount: false });
    }, []);

    const handleSubmit = (formData) => {
       if(formData.plate === "") return;
       setClient({value: formData.plate, haveAccount: false });
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
            <Modal show={showModal}>
                <h2>Sign down</h2>
                <p>This is the Sign Up pop-up content!</p>
                <button onClick={handleCloseModal}>Close</button>
            </Modal >
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