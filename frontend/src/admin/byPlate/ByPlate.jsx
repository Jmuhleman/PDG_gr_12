import React, {useState} from 'react';
import './byPlate.css';
import { APIGetRequest } from '../../utils/APIRequest';
import { urlAPI } from '../../config';

const ByPlate = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showBills, setShowBills] = useState(true);
    const [plate, setPlate] = useState('');

    const [profile, setProfile] = useState(undefined);
    const [bills, setBills] = useState([]);
    const [statusProfile, setStatusProfile] = useState({code: 0, text: ''});
    const [statusBills, setStatusBills] = useState({code: 0, text: ''});

    const submitPlate = async () => {
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
                { showProfile && <div className='profile-info'>
                    <p>Nom: <span>John Doe</span></p>
                    <p>Adresse: <span>1234 rue de la rue</span></p>
                    <p>Ville: <span>Montréal</span></p>
                    <p>Province: <span>QC</span></p>
                    <p>Code postal: <span>H0H0H0</span></p>
                    <p>Téléphone: <span>514-123-4567</span></p>
                </div>}
            </div>}
            {bills.length !== 0 && <div className='BPdata'>
                <h2 onClick={()=>setShowBills(!showBills)}>Facture ouverte</h2>
                {bills && showBills && <table>
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
                        <tr>
                            <td>123456</td>
                            <td>12:00</td>
                            <td>14:00</td>
                            <td>2h</td>
                            <td>5$</td>
                        </tr>
                    </tbody>
                </table>}
            </div>}
            <button className='back-btn btn white-btn' onClick={() => window.history.back()}>Retour</button>
        </div>
    );
};

export default ByPlate;