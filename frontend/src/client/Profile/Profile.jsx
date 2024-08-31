import React, { useEffect, useState } from 'react';
import { useClient } from '../hooks/useClient';
import { APIGetRequest, APIDeleteRequest, APIPostRequest } from '../../utils/APIRequest';
import "./profile.css"
import PlateButton from '../../components/PlateButton';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [DeleteStatus, setDeleteStatus] = useState({code: 0, text: ""});
    const userId = useClient.value;
    const [canDeletePlate, setCanDeletePlate] = useState(false);

    useEffect(() => {
        APIGetRequest({url: `http://localhost:5000/api/users/${userId}`, setData: setProfileData, setStatus: ()=>{}});
    }, [userId]);

    const handelDeletePlate = async (plate) => {
        await APIDeleteRequest({url: `http://localhost:5000/api/users/${userId}/plates/${plate}`, setStatus: setDeleteStatus});
    }
    
    const [newPlate, setNewPlate] = useState("");
    const [newPlateStatus, setNewPlateStatus] = useState({code: 0, text: ""});
    const handleChangeNewPlate = (e) => {
        setNewPlate(e.target.value);
    }
    const handleAddPlate = async (event) => {
        event.preventDefault();
        await APIPostRequest({url: `http://localhost:5000/api/users/${userId}/plates`, data: {plate: newPlate}, setStatus: setNewPlateStatus});

    }

    const [showAddPlate, setShowAddPlate] = useState(false);
    const handleModifPlate = () => {
        setCanDeletePlate(!canDeletePlate)
        setShowAddPlate(!showAddPlate)
    }

    return (
        <div>
            {profileData ? (
                <div className='profilePanel'>
                    <h1>{profileData.lastname + " " + profileData.firstname}</h1>
                    <span><p>Plate:</p><button className='btn white-btn' onClick={handleModifPlate}>Modifier</button></span>
                    <p style={{color: 'red'}}>{DeleteStatus.text}</p>
                    {profileData.plates.map((plate, index)=><PlateButton key={index} value={plate} text={plate} onClick={handelDeletePlate} isDisabled={!canDeletePlate}/>)}
                    {showAddPlate && <form className='addPlateForm' action={handleAddPlate}>
                        <label htmlFor='newPlate'>Nouvelle Plaque</label>
                        <input id='newPlate' className='textarea' name='NewPlate' type='text' value={newPlate} onChange={handleChangeNewPlate} placeholder='VD12345' />
                        <input className='submit btn blue-btn' type='submit' value={"Ajouter la plaque d'immatriculation"} />
                    </form>}
                    <p style={{color: 'red'}}>{newPlateStatus.text}</p>
                </div>
            ) : (
                <p>Loading profile data...</p>
            )}
            <button className='btn white-btn' onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default Profile;