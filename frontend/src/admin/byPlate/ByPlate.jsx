import React, {useState} from 'react';
import './byPlate.css';
import { APIGetRequest } from '../../utils/APIRequest';
import { urlAPI } from '../../config';
import { DateTime } from 'luxon';

const ByPlate = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showBills, setShowBills] = useState(true);
    const [plate, setPlate] = useState('');

    const [profile, setProfile] = useState(undefined);
    const [bills, setBills] = useState({});
    const [statusProfile, setStatusProfile] = useState({code: 0, text: ''});
    const [statusBills, setStatusBills] = useState({code: 0, text: ''});

    const submitPlate = async () => {
        setProfile(undefined);
        setBills([]);
        setShowBills(true);
        setShowProfile(false);
        await APIGetRequest({url: `${urlAPI}/users/plates/${plate}`, setData: setProfile, setStatus: setStatusProfile});
        await APIGetRequest({url: `${urlAPI}/plate/${plate}`, setData: setBills, setStatus: setStatusBills});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitPlate();
    }

    return (
        <div>
            <h1>Par plaque</h1>
            <p style={{color: 'red'}}>{(statusProfile.code<200 || statusProfile.code >=300) && statusProfile.text}</p>
            <p style={{color: 'red'}}>{(statusBills.code<200 || statusBills.code >=300) && statusBills.text}</p>
            <form className='BPform' onSubmit={handleSubmit} ><input className='BPC' value={plate} onChange={(e)=>setPlate(e.target.value)} type="text" placeholder="Plaque d'immatriculation"/><input type="submit" value="Rechercher"/></form>
            {profile &&<div className='profile'>
                <h2 onClick={()=>setShowProfile(!showProfile)}>Propriétaire</h2>
                {console.log(profile)}
                { showProfile && <div className='profile-info'>
                    <p>Nom: <span>{profile.lastname} {profile.firstname}</span></p>
                    <p>Adresse: <span>{profile.address.number} {profile.address.street}</span></p>
                    <p>Ville: <span>{profile.address.city}</span></p>
                    <p>Province: <span>{profile.address.country}</span></p>
                    <p>Code postal: <span>{profile.address.zip}</span></p>
                    <p>Téléphone: <span>{profile.phone}</span></p>
                </div>}
            </div>}
            {Object.entries(bills).length !== 0 && <div className='BPdata'>
                <h2 onClick={()=>setShowBills(!showBills)}>Facture ouverte</h2>
                {showBills && <table>
                    <thead>
                        <tr>
                            <th>Plaque</th>
                            <th>Entrée</th>
                            <th>Sortie</th>
                            <th>Durée</th>
                            <th>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                            {Object.entries(bills).map(([plate, info]) => {
                                return Object.entries(info).map((entry, index) => {
                                    const dateTimeIn = DateTime.fromJSDate(new Date(entry[1].timestamp_in)).setLocale('fr').toFormat('dd LLL yyyy hh:mm');
                                    const dateTimeOut = DateTime.fromJSDate(new Date(entry[1].timestamp_out)).setLocale('fr').toFormat('dd LLL yyyy hh:mm');
                                    return <tr key={index}>
                                        <td>{plate}</td>
                                        <td>{dateTimeIn}</td>
                                        <td>{dateTimeOut}</td>
                                        <td>{entry[1].duration}</td>
                                        <td>{entry[1].amount}</td>
                                    </tr>})
                            })
                            }
                    </tbody>
                </table>}
            </div>}
            <button className='back-btn btn white-btn' onClick={() => window.history.back()}>Retour</button>
        </div>
    );
};

export default ByPlate;