import React, { useEffect, useState } from 'react';
import { APIGetRequest } from '../utils/APIRequest';
import { useClient } from './hooks/useClient';

export default function BillingOverview() {
    const [data, setdata] = useState("d");

    const [client] = useClient();

    useEffect(() => {
        if (!client.haveAccount)
            APIGetRequest({url: 'https://66ccf8798ca9aa6c8cc92883.mockapi.io/api/plate', setResponse: setdata});
    }, [client]);

    return (
        <div>
            <h1>Toutes vos facture</h1>
            <p>{data?data:"loading"}</p>
        </div>
    );
}