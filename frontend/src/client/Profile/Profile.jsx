import React, { useEffect, useState } from 'react';
import { useClient } from '../hooks/useClient';
import { useNavigate } from 'react-router-dom';
import { APIGetRequest, APIDeleteRequest, APIPostRequest } from '../../utils/APIRequest';
import "./profile.css"
import PlateButton from '../../components/PlateButton';
import { useCookies } from 'react-cookie';
import SubmitForm from '../../components/SubmitForm';
import { urlAPI } from '../../config';

const Profile = () => {
    const [cookies] = useCookies(['client']);
    const [profileData, setProfileData] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState({code: 0, text: ""});
    const {client, setClient} = useClient();
    const navigate = useNavigate();
    const [canDeletePlate, setCanDeletePlate] = useState(false);
    const [newPlate, setNewPlate] = useState("");
    const [newPlateStatus, setNewPlateStatus] = useState({code: 0, text: ""});

    useEffect(() => {
        if (client.value === "" && cookies.client.value === "")
        {
            navigate('/');
        } else if (client.value === ""){
            setClient(cookies.client);
        }
        else{
            APIGetRequest({url: `${urlAPI}/users/${client.value}`, setData: setProfileData, setStatus: ()=>{}});
        }
    }, [client, navigate, newPlateStatus, deleteStatus]);

    const handelDeletePlate = async (plate) => {
        await APIDeleteRequest({url: `${urlAPI}/users/${client.value}/plate/${plate}`, setStatus: setDeleteStatus});
    }
    
    const handleChangeNewPlate = (e) => {
        setNewPlate(e.target.value);
    }
    const handleAddPlate = async (event) => {
        event.preventDefault();
        await APIPostRequest({url: `${urlAPI}/users/${client.value}/plate`, data: {plate: newPlate}, setStatus: setNewPlateStatus});
    }

    const [showAddPlate, setShowAddPlate] = useState(false);
    const handleModifPlate = () => {
        setCanDeletePlate(!canDeletePlate)
        setShowAddPlate(!showAddPlate)
    }

    const [changePassword, setChangePassword] = useState(false);
    const [changePasswordStatus, setChangePasswordStatus] = useState({code: 0, text: ""});
    const handleChangePassword = async (formData) => {
        const data = {old: formData.oldPassword, new: formData.password}
        await APIPostRequest({url: `${urlAPI}/users/${client.value}/password`, data: data, setStatus: setChangePasswordStatus});
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
                    {showAddPlate && <p style={{color: 'red'}}>{deleteStatus.text}</p>}
                    <div className='plates'>
                        {profileData.plates.map((plate, index)=><PlateButton key={index} value={plate} text={plate} onClick={handelDeletePlate} isDisabled={!canDeletePlate}/>)}
                    </div>
                    {showAddPlate && <form className='addPlateForm' onSubmit={handleAddPlate}>
                        <label htmlFor='newPlate'>Nouvelle Plaque</label>
                        <input id='newPlate' className='textarea' name='NewPlate' type='text' value={newPlate} onChange={handleChangeNewPlate} placeholder='VD12345' />
                        <input className='submit btn blue-btn' type='submit' value={"Ajouter la plaque d'immatriculation"} />
                    </form>}
                    {showAddPlate && <p style={{color: 'red'}}>{newPlateStatus.text}</p>}
                </div>
            ) : (
                <p>Loading profile data...</p>
            )}
            <div className='separator' />
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