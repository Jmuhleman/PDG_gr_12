import React, { useEffect, useState } from 'react';
import { useClient } from '../hooks/useClient';
import { useNavigate } from 'react-router-dom';
import { APIGetRequest, APIDeleteRequest, APIPostRequest, APIPatchRequest } from '../../utils/APIRequest';
import "./profile.css"
import PlateButton from '../../components/PlateButton';
import SubmitForm from '../../components/SubmitForm';
import { urlAPI } from '../../../config';
import argon2 from 'argon2';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [DeleteStatus, setDeleteStatus] = useState({code: 0, text: ""});
    const userId = useClient.value;
    const navigate = useNavigate();
    const [canDeletePlate, setCanDeletePlate] = useState(false);

    useEffect(() => {
        if (userId === "") navigate('/');
        APIGetRequest({url: `${urlAPI}/api/users/${userId}`, setData: setProfileData, setStatus: ()=>{}});
    }, [userId, navigate]);

    const handelDeletePlate = async (plate) => {
        await APIDeleteRequest({url: `${urlAPI}/api/users/${userId}/plate/${plate}`, setStatus: setDeleteStatus});
    }
    
    const [newPlate, setNewPlate] = useState("");
    const [newPlateStatus, setNewPlateStatus] = useState({code: 0, text: ""});
    const handleChangeNewPlate = (e) => {
        setNewPlate(e.target.value);
    }
    const handleAddPlate = async (event) => {
        event.preventDefault();
        await APIPostRequest({url: `${urlAPI}/api/users/${userId}/plate`, data: {plate: newPlate}, setStatus: setNewPlateStatus});

    }

    const [showAddPlate, setShowAddPlate] = useState(false);
    const handleModifPlate = () => {
        setCanDeletePlate(!canDeletePlate)
        setShowAddPlate(!showAddPlate)
    }

    const [changePassword, setChangePassword] = useState(false);
    const [changePasswordStatus, setChangePasswordStatus] = useState({code: 0, text: ""});
    const handleChangePassword = async (formData) => {
        const data = {password: await argon2.hash(formData.oldPassword), new_password: await argon2.hash(formData.password)}
        await APIPatchRequest({url: `${urlAPI}/api/users/${userId}/change_password`, data: data, setStatus: setChangePasswordStatus});
    };
    const changePasswordFields = [
        { id: 'oldPassword', label: 'Ancien mot de passe', type: 'Password', placeholder: 'votre ancien mot de passe', className: 'full-width' },
        { id: 'password', label: 'Nouveau mot de passe', type: 'password', placeholder: 'votre nouveau mot de passe', className: 'full-width' },
        { id: 'confirmPassword', label: 'Confirmation', type: 'password', placeholder: 'votre mot de passe', className: 'full-width' }
    ];

    return (
        <div className='profile'>
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
            <button onClick={()=>setChangePassword(!changePassword)} className='btn blue-btn'>Changer de mot de passe</button>
            { profileData && changePassword && <SubmitForm 
                label='Change Password' 
                buttonText='Confirmer' 
                onSubmit={handleChangePassword} 
                fieldsConfig={changePasswordFields} 
                message={changePasswordStatus.text} />}

            <button className='btn white-btn' onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default Profile;