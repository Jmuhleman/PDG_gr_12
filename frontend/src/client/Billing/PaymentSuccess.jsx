import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import './billing.css';
import { APIPostRequest } from '../../utils/APIRequest';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [params] = React.useState({
        "payment_intent": searchParams.get("payment_intent"),
        "client_secret": searchParams.get("client_secret"),
        "redirect_status": searchParams.get("redirect_status")
    });

    const handleNavigate = () => {
        navigate('/billingOverview');
    };

    useEffect(() => {
        if(searchParams.size === 3 && params.payment_intent && params.client_secret && params.redirect_status)
            APIPostRequest({url: 'http://localhost:5000/api/finalize-payement', data: params, setData: ()=>{}, setStatus: ()=>{}});
    }, []);

    return (
        <div>
            {searchParams.get("redirect_status") === "succeeded" && <h2>Paiement Effectué !</h2>}
            {searchParams.get("redirect_status") === "failed" && <h2>Erreur lors du paiement</h2>}
            <button className='btn blue-btn' onClick={handleNavigate}>Retour à la liste des factures</button>
        </div>
    );
};

export default PaymentSuccess;