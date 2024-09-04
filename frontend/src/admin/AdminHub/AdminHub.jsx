import React from 'react';
import { NavLink } from 'react-router-dom';
import './adminHub.css';

const AdminHub = () => {

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.href = '/admin';
    };

    return (<>
        <div className='PanelAdmin'>
            <NavLink to="/admin/fares" className='nav-btn fares-btn'><p>Tarif</p></NavLink>
            <NavLink to="/admin/log" className='nav-btn log-btn'><p>Log</p></NavLink>
            <NavLink to="/admin/byPlate" className='nav-btn byPlate-btn'><p>Par plaque</p></NavLink>
        </div>
        <button onClick={(handleLogout)} className='logout btn white-btn'>Logout</button>
    </>);
};

export default AdminHub;