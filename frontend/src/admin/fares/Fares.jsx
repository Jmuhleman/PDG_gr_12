import React, { useEffect, useState } from 'react';

const data = [
    {
        name: 'Label 1',
        id: 1,
        fare: 123
    },
    {
        name: 'Label 2',
        id: 2,
        fare: 123
    },
    {
        name: 'Label 3',
        id: 3,
        fare: 123
    }
]

const Fares = () => {
    const [fares, setFares] = useState([]);

    useEffect(() => {
        setFares(data);
    }, []);

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

    return (<>
        <h1>Tarif</h1>
        <table>
            <thead>
                <tr>
                    <th>Parking</th>
                    <th>Tarif horaire</th>
                </tr>
            </thead>
            <tbody>
                {
                    fares && fares.map(fare => (
                        <tr key={fare.id}>
                            <td>{fare.name}</td>
                            <td><input type="number" min='0' value={fare.fare} onChange={(e)=>handleChangeFares(fare.id, e.target.value)}/></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <button className='btn white-btn' onClick={() => window.history.back()}>Retour</button>
    </>);
};

export default Fares;