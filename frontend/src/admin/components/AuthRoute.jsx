import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { APIGetRequest, APIPostRequestWithoutCredentials } from '../../utils/APIRequest';
import { urlAPI } from '../../config';
import SubmitForm from '../../components/SubmitForm';

const AuthRoute = () => {

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(['client']);
    const [signInData, setSignInData] = useState({ jwt: '', id: 0, status: "" });
    const [authenticated, setAuthenticated] = useState(false);
    const [statusValidation, setStatusValidation] = useState({ code: 0, text: "" });
    const [signInStatus, setSignInStatus] = useState({ code: 0, text: "" });

    const LoginConfig = [
        { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', className: 'full-width' },
        { id: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', className: 'full-width' }
    ];

    const handleLogin = async ({email, password}) => {
        const formData = {"email": email, "password": password};
        console.log('Login form submitted:', formData);
        // Add actual login logic here
        await APIPostRequestWithoutCredentials({ url: `${urlAPI}/admin/sign_in`, data: formData, setData: setSignInData, setStatus: setSignInStatus });
    };
    

    useEffect(() => {
        if (signInData.jwt!=='') {
            setCookie('access_token', signInData.jwt, { path: '/', expires: new Date(Date.now() + 86400000) });
            setCookie('admin', signInData.id, { path: '/', expires: new Date(Date.now() + 86400000) });
        } else if (cookies.access_token) {
            setSignInData({ jwt: cookies.access_token, id: cookies.admin , status: "connected" });
        }
        if(signInData.id !== 0) {
            APIGetRequest({url: `${urlAPI}/users/${signInData.id}/validation_jwt`, setData: (e)=>e, setStatus:setStatusValidation})
        }
    }, [signInData, setCookie]);

    useEffect(() => {
        if(statusValidation.code === 0) {
            return;
        }
        if (statusValidation.code === 200) {
            setAuthenticated(true);
        } else if(statusValidation.code === 401) {
            setAuthenticated(false);
            setCookie('access_token', '', { path: '/' });
            setCookie('admin', '', { path: '/' });
        }
    }, [statusValidation]);

    if (authenticated) {
        return <Outlet />;
    } else {
        return (
            <SubmitForm
          label="Panneau d'administration"
          fieldsConfig={LoginConfig}
          onSubmit={handleLogin}
          message={signInStatus ? signInStatus.text : ''}
        />
        );
    }
};



export default AuthRoute;