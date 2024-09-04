import React, { useEffect, useState } from 'react';
import { APIGetRequest, APIPatchRequest } from '../../utils/APIRequest';
import { urlAPI } from '../../config';

const Fares = () => {
    const [fares, setFares] = useState([]);
    const [status, setStatus] = useState({code: 0, text: ''});

    useEffect( () => {
        APIGetRequest({url: `${urlAPI}/admin/parking/fares`, setData: setFares, setStatus: setStatus});
    }, []);

    const handleSubmit = () => {
        APIPatchRequest({url: `${urlAPI}/admin/parking/fares`, data: fares, setStatus: setStatus});
    }

    const handleChangeFares = (id, value) => {
        let newFares = fares
        if(value>0){
            newFares = fares.map(fare => {
                if (fare.id === id) {
                    fare.fare = value;
                }
                return fare;
            });
        }
        setFares(newFares);
    };

    useEffect(() => {console.log(status.code)}, [status]);

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
                        <tr key={fare.id}>
                            <td>{fare.name}</td>
                            <td><input type="number" min='0' value={fare.fare} onChange={(e)=>handleChangeFares(fare.id, e.target.value)}/></td>
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