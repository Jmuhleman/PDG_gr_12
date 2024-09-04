import React, { useEffect, useState } from 'react';
import { APIGetRequest, APIPatchRequest } from '../../utils/APIRequest';
import { urlAPI } from '../../config';
import './fares.css';

const Fares = () => {
    const [fares, setFares] = useState([]);
    const [faresByID, setFaresByID] = useState({});
    const [status, setStatus] = useState({code: 0, text: ''});

    const initialize = (data) => {
        setFares(data)
        let temp = {}
        data.map(fare => Object.assign(temp, {[fare.parking_id]: fare.fare}))
        setFaresByID(temp)
    }

    useEffect( () => {
        APIGetRequest({url: `${urlAPI}/parking/fares`, setData: initialize, setStatus: setStatus});
    }, []);

    const handleSubmit = () => {
        const newFares = Object.entries(faresByID).map(([key, value]) => ({parking_id: key, fare: value}));
        APIPatchRequest({url: `${urlAPI}/parking/fares`, data: newFares, setStatus: setStatus});
    }

    const handleChangeFares = (id, value) => {
        if(value !== '' && !isNaN(value)) 
            setFaresByID({...faresByID, [id]: parseInt(value)})
    };

    return (<>
        <h1>Tarif</h1>
        <p style={{color: 'red'}}>{(status.code<200 || status.code >=300) && status.text}</p>
        {fares.length !== 0 && <table>
            <thead>
                <tr>
                    <th>Parking</th>
                    <th>Tarif horaire</th>
                </tr>
            </thead>
            <tbody>
                {
                    fares.map(fare => (
                        <tr key={fare.parking_id}>
                            <td>{fare.parking_name}</td>
                            <td><input type="number" min='1' value={faresByID[fare.parking_id]} onChange={(e)=>handleChangeFares(fare.parking_id, e.target.value)}/></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>}
        <button className='btn white-btn' onClick={() => window.history.back()}>Retour</button>
        {fares.length !== 0 && <button className='btn blue-btn' onClick={() => handleSubmit()}>Sauvegarder</button>}
    </>);
};

export default Fares;