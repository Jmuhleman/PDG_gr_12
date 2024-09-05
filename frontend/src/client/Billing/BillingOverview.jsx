import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { APIGetRequest, APIPostRequest } from '../../utils/APIRequest';
import { useClient } from '../hooks/useClient';
import { DateTime } from 'luxon';
import { useCookies } from 'react-cookie'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import BillingSummary from './BillingSummary';
import StripeCheckout from '../../components/StripeCheckout';
import { urlAPI } from '../../config.js';

import './billing.css';

const stripePromise = loadStripe('pk_test_51Pt6wyRvF3tg1R6wz7YSiyG6z01KIUdvstXdu5CnjIwrAOkJkQZfKvzmOBiGuuVo2t8Tiv7xXPlD609PSShBjNuj00wmypaePA');

export default function BillingOverview() {
    const [data, setData] = useState({});
    const [selectedBill, setSelectedBill] = useState(undefined);
    const [status, setStatus] = useState(undefined);
    const [cookies] = useCookies(['client']);

    const [filter, setFilter] = useState({plate: [], idBill: []});
    const [showCheckout, setShowCheckout] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loadIntent, setLoadIntent] = useState(false);

    const [stripeOptions, setStripeOptions] = useState({});

    const {client, setClient} = useClient();
    const [profile, setProfile] = useState();
    const [noData, setNoData] = useState(true);

    const navigate = useNavigate()

    const handleSetProfile = (data) => {
        setProfile(data);
    }

    async function getProfileAndPlate() {
        let status = {code: 0, text: ""};
        const setStatus = (e) => status = e;
        await APIGetRequest({
            url: `${urlAPI}/users/${client.value}`,
            setData: handleSetProfile,
            setStatus: setStatus
        });
        if(status.code === 401) {
            console.log("unAuthorized");
            navigate('/');
        }
    }

    useEffect(() => {
        setClient(cookies.client);
        if (client.value === "" && cookies.client.value === "") navigate('/');
        if (!client.haveAccount && client.value !== "")
            APIGetRequest({url: `${urlAPI}/plate/${client.value}`, setData: setData, setStatus: setStatus});
        else if(client.haveAccount && cookies.client.value !== ""){
            getProfileAndPlate();
        }
    }, [client.haveAccount, client.value, navigate, cookies.client, setClient]);

    useEffect(() => {
        if (profile) {
            const fetchPlates = async () => {
                let platesData = {};
                const assignPlate = (d) => {
                    Object.assign(platesData, d)
                };
                let status = {code: 0, text: ""};
                const setStatus = (e) => status = e;

                await Promise.all(
                    profile.plates.map(async (plate) => {
                        await APIGetRequest({
                            url: `${urlAPI}/plate/${plate}`,
                            setData: assignPlate,
                            setStatus: setStatus
                        });
                        if(status.code === 204) {
                            console.log(`Plate ${plate} has no billing data`);
                            assignPlate({[plate]: []});
                        }else{
                            setNoData(false)
                        }
                    })
                );

                setData(platesData);
            };

            fetchPlates();
        }
    }, [profile]);

    useEffect(() => {
        if(data.length === 0) return;
        const fil1 = Object.entries(data).filter(([plate])=> filter.plate.length === 0 ? true : filter.plate.includes(plate))
        const fil2 = fil1.map(([plate, info]) => [plate, info.filter(({parking}) => filter.idBill.length === 0 ? true : filter.idBill.includes(parking))])
        // eslint-disable-next-line no-unused-vars
        setTotalAmount(fil2.map(([plate, info]) => info.map(({amount}) => parseFloat(amount)).reduce((acc, curr) => acc + curr, 0)).reduce((acc, curr) => acc + curr, 0))
        setSelectedBill(fil2);
    }, [data, filter, cookies.client]);

    useEffect(() => {
        if(loadIntent)
            getClientSecret();
    }, [selectedBill]);

    async function getClientSecret(){
        // Fetch client secret when data is available
        // eslint-disable-next-line no-unused-vars
        const tickets_id = selectedBill.map(([plate, infoBill]) => infoBill.map(({id}) => id)).flat();
        await APIPostRequest({url: `${urlAPI}/create_payment_intent`, data: {amount: totalAmount, currency: "CHF", ticket_id: tickets_id}, setData: setStripeOptions, setStatus: setStatus});
        setShowCheckout(true);
    }

    const handleOnClick = (value) => {
        return async () => {
            setFilter(value);
            setLoadIntent(true);
        }
    }

    return (
        <div className='overview'>
            <h1>Toutes vos factures</h1>
            {
                status && status.code !== 200 ? <h2>Request Status : {status.text}</h2> : null
            }
            {
                client.haveAccount && <div className='profile'>
                    <NavLink to='/profile' className='btn blue-btn'>Profile</NavLink>
                </div>
            }
            {
                !data ? <p>Chargement...</p> : null
            }
            {
                data && Object.entries(data).map(([plate, infoBill]) => {
                    if(infoBill.length === 0) return <h2 key={plate}>Pas de facture pour la plaque {plate}</h2>
                    else {
                        return (<div key={plate}>
                            <h2>Facture pour la plaque {plate}</h2>
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
                            <button onClick={handleOnClick({plate:[plate], idBill:[]})} className='btn blue-btn pay-plate-pbt'>Payer pour la plaque {plate}</button>
                        </div>)
                    }
                })
            }
            <button className='btn white-btn' onClick={() => navigate('/')}>Retour</button>
            { client.haveAccount && !noData && <button className='btn blue-btn' onClick={handleOnClick({plate: [], idBill:[]})}>Payer Tout</button> }
            
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
                    <button className='btn white-btn' onClick={() => {setShowCheckout(false); setLoadIntent(false);}}>Annuler</button>
                </div>
            </div></div>}
        </div>
    );
}