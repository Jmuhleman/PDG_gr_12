import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIGetRequest } from '../../utils/APIRequest';
import { useClient } from '../hooks/useClient';
import BillingSummary from './BillingSummary';
import './billing.css'; 

export default function BillingOverview() {
    const [data, setData] = useState(undefined);
    const [status, setStatus] = useState(undefined);

    const {client} = useClient();

    const navigate = useNavigate()

    /*useEffect(() => {
        if (client.value === "") navigate('/');
        if (!client.haveAccount)
            APIGetRequest({url: 'https://66ccf8798ca9aa6c8cc92883.mockapi.io/api/plate', setData: setData, setStatus: setStatus});
    }, [client.haveAccount, client.value, navigate]);*/

    useEffect(() => {
        setStatus({code: 200, text: "OK"});
        setData(
            {
                "GE67890": [
                    {
                        "parking_name": "Main Lot",
                        "timestamp_in": "2024-08-25T08:30:00+01:00",
                        "timestamp_out": "2024-08-25T17:00:00+01:00",
                        "duration": 90,
                        "amount": 25.5
                    },
                    {
                        "parking_name": "East Lot",
                        "timestamp_in": "2024-08-26T09:00:00+01:00",
                        "timestamp_out": "2024-08-26T12:00:00+01:00",
                        "duration": 180,
                        "amount": 30.0
                    }
                ]
            }
        )
    }, []);

    return (
        <div>
            <h1>Toutes vos factures</h1>
            {
                status && status.code !== 200 ? <h2>Request Status : {status.text}</h2> : null
            }
            {
                !status ? <p>Chargement...</p> : null
            }
            {
                data && Object.entries(data).map(([plate, infoBill]) => {
                    return (<div key={plate}>
                        <h2>Facture pour la plaque {plate}</h2>
                        <div className="billings">
                            {
                                infoBill.map(({parking_name, timestamp_in, timestamp_out, duration, amount }, index) => {
                                    return <BillingSummary key={ timestamp_in+index } 
                                        parking_name={ parking_name }
                                        timestamp_in={ timestamp_in }
                                        timestamp_out={ timestamp_out }
                                        duration={ duration}
                                        amount={ amount } />
                                })
                            }
                        </div>
                    </div>)
                })
            }
            <button onClick={() => navigate('/')}>Retour</button>
        </div>
    );
}