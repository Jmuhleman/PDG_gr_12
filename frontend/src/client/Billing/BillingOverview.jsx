import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIGetRequest, APIPostRequest } from '../../utils/APIRequest';
import { useClient } from '../hooks/useClient';
import { DateTime } from 'luxon';
import { useCookies } from 'react-cookie'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import BillingSummary from './BillingSummary';
import StripeCheckout from '../../components/StripeCheckout';
import './billing.css'; 

const stripePromise = loadStripe('pk_test_51Pt6wyRvF3tg1R6wz7YSiyG6z01KIUdvstXdu5CnjIwrAOkJkQZfKvzmOBiGuuVo2t8Tiv7xXPlD609PSShBjNuj00wmypaePA');

export default function BillingOverview() {
    const [data, setData] = useState(undefined);
    const [selectedBill, setSelectedBill] = useState(undefined);
    const [status, setStatus] = useState(undefined);
    const [cookies] = useCookies(['client']);

    const [filter, setFilter] = useState({plate: [], idBill: []});
    const [showCheckout, setShowCheckout] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    const [stripeOptions, setStripeOptions] = useState({});

    const {client, setClient} = useClient();

    const navigate = useNavigate()

    useEffect(() => {
        setClient(cookies.client);
        if (client.value === "" && cookies.client.value === "") navigate('/');
        if (!client.haveAccount && client.value !== "")
            APIGetRequest({url: 'http://localhost:5000/api/plate/' + client.value, setData: setData, setStatus: setStatus});
    }, [client.haveAccount, client.value, navigate, cookies.client, setClient]);

    useEffect(() => {
        if(data === undefined) return;
        const fil1 = Object.entries(data).filter(([plate])=> filter.plate.length === 0 ? true : filter.plate.includes(plate))
        const fil2 = fil1.map(([plate, info]) => [plate, info.filter(({parking}) => filter.idBill.length === 0 ? true : filter.idBill.includes(parking))])
        // eslint-disable-next-line no-unused-vars
        setTotalAmount(fil2.map(([plate, info]) => info.map(({amount}) => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)).reduce((acc, curr) => acc + curr, 0))
        setSelectedBill(fil2);
    }, [data, filter, cookies.client]);

    async function getClientSecret(){
        // Fetch client secret when data is available
        await APIPostRequest({url: 'http://localhost:5000/api/create-payment-intent', data: {amount: totalAmount, currency: "CHF"}, setData: setStripeOptions, setStatus: setStatus});
        console.log(stripeOptions);
    }

    const handleOnClick = (value) => {
        return async () => {
            setFilter(value);
            await getClientSecret();
            setShowCheckout(true);
        }
    }

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
                        <h2 onClick={handleOnClick({plate:[plate], idBill:[]})}>Facture pour la plaque {plate}</h2>
                        <div className="billings">
                            {
                                infoBill.map(({parking, timestamp_in, timestamp_out, duration, amount }, index) => {
                                    return <BillingSummary key={ timestamp_in+index }
                                        plate={ plate }
                                        parking={ parking }
                                        timestamp_in={ timestamp_in }
                                        timestamp_out={ timestamp_out }
                                        duration={ duration}
                                        amount={ amount }
                                        onClick={handleOnClick} />
                                })
                            }
                        </div>
                    </div>)
                })
            }
            <button className='btn white-btn' onClick={() => navigate('/')}>Retour</button>
            { client.haveAccount && <button className='btn blue-btn' onClick={handleOnClick({plate: [], idBill:[]})}>Payer Tout</button>}
            
            { selectedBill && showCheckout && <div className="checkoutBackground"><div className="checkoutPanel">
                <h1>Récapitulatif et paiment</h1>
                <ul className="summeryCheckout">
                    {
                        selectedBill && selectedBill.map(([plate, infoBill]) => {
                            return infoBill.map(({parking, timestamp_in, duration, amount }, index) => {
                                const timestamp = DateTime.fromJSDate(new Date(timestamp_in)).setLocale('fr').toFormat('dd/LL/yyyy hh:mm');
                                const durationFormated = parseInt(parseFloat(duration)/60) + "h " + parseFloat(duration)%60 + "m";
                                return <li className='checkoutLine' key={plate+index}>
                                    <div className='co_visible'>
                                        <div className='co_plate'>{plate + ":" + timestamp}</div>
                                        <div className='co_amount'>{amount}</div>
                                    </div>
                                    <div className='co_parking'>{parking + " : " + durationFormated}</div>
                                </li>
                            })
                        })
                    }
                    <li className='totalCheckout'><p>Total</p><p>{totalAmount+".-"}</p></li>
                </ul>
                <Elements stripe={stripePromise} options={stripeOptions}>
                    <StripeCheckout />
                </Elements>
                <div className="checkoutButton">
                    <button className='btn white-btn' onClick={() => setShowCheckout(false)}>Annuler</button>
                </div>
            </div></div>}
        </div>
    );
}