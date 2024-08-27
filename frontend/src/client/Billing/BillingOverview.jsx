import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIGetRequest } from '../../utils/APIRequest';
import { useClient } from '../hooks/useClient';
import BillingSummary from './BillingSummary';
import './billing.css'; 

export default function BillingOverview() {
    const [data, setdata] = useState(undefined);
    const [status, setStatus] = useState(undefined);

    const {client} = useClient();

    const navigate = useNavigate()

    useEffect(() => {
        if (client.value === "") navigate('/');
        if (!client.haveAccount)
            APIGetRequest({url: 'https://66ccf8798ca9aa6c8cc92883.mockapi.io/api/plate', setData: setdata, setStatus: setStatus});
    }, [client.haveAccount, client.value, navigate]);

    return (
        <div>
            <h1>Toutes vos facture</h1>
            {
                status && status.code !== 200 && <h2>Request Status : {status.text}</h2>
            }
            {
                !status && <p>Chargement...</p>
            }
            <div className="billings">
            {
                data && data.map(({parking_name, timestamp_in, timestamp_out, duration, amount }, index) => {
                    return <BillingSummary key={ timestamp_in+index } 
                        parking_name={ parking_name }
                        timestamp_in={ timestamp_in }
                        timestamp_out={ timestamp_out }
                        duration={ duration}
                        amount={ amount } />
                })
            }
            </div>
        </div>
    );
}