import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import SubmitForm from '../../components/SubmitForm';  
import { useClient } from '../hooks/useClient';
import { useNavigate } from 'react-router-dom';
import './home.css'


function Home() {
    const {setClient } = useClient();
    const navigate = useNavigate();
    useEffect(() => {
        setClient({ value: "", haveAccount: false });
    }, []);

    const handleSubmit = (text) => {
        if(text === "") return;
        // Ensure setClient is used correctly. Assuming it expects an object with properties.
        setClient({value: text, haveAccount: false });
        navigate('/billing_overview');
    };

    return (
        <div>
            <h1>Welcome to Our Website</h1>
            <p>This is the homepage where you can find an overview of our services and features.</p>
            <SubmitForm
                label="Numéro de plaque : "
                placeholder="VDO9815..."
                buttonText="Valider"
                onSubmit={handleSubmit}
            />

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