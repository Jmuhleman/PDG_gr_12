import React, { useEffect, useState } from 'react';
import { APIGetRequest } from '../../utils/APIRequest';
import { useClient } from '../hooks/useClient';
import BillingSummary from './BillingSummary';
import './billing.css'; 

export default function BillingOverview() {
    const [data, setdata] = useState(undefined);

    const {client} = useClient();

    useEffect(() => {
        if (!client.haveAccount)
            APIGetRequest({url: 'https://66ccf8798ca9aa6c8cc92883.mockapi.io/api/plate', setResponse: setdata});
    }, [client.haveAccount]);

    return (
        <div>
            <h1>Toutes vos facture</h1>
            {
                !data && <p>Chargement...</p>
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