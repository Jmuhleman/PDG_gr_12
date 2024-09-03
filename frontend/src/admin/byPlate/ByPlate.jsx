import React from 'react';
import './byPlate.css';

const ByPlate = () => {
    const [showProfile, setShowProfile] = React.useState(false);
    const [showBills, setShowBills] = React.useState(true);
    return (
        <div>
            <h1>Par plaque</h1>
            <form className='BPform'><input className='BPC' type="text" placeholder="Plaque d'immatriculation"/><input type="submit" value="Rechercher"/></form>
            <div className='profile'>
                <h2 onClick={()=>setShowProfile(!showProfile)}>Propriétaire</h2>
                {showProfile && <div className='profile-info'>
                    <p>Nom: <span>John Doe</span></p>
                    <p>Adresse: <span>1234 rue de la rue</span></p>
                    <p>Ville: <span>Montréal</span></p>
                    <p>Province: <span>QC</span></p>
                    <p>Code postal: <span>H0H0H0</span></p>
                    <p>Téléphone: <span>514-123-4567</span></p>
                </div>}
            </div>
            <div className='BPdata'>
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
                        <tr>
                            <td>123456</td>
                            <td>12:00</td>
                            <td>14:00</td>
                            <td>2h</td>
                            <td>5$</td>
                        </tr>
                    </tbody>
                </table>}
            </div>
            <button className='btn white-btn' onClick={() => window.history.back()}>Retour</button>
        </div>
    );
};

export default ByPlate;