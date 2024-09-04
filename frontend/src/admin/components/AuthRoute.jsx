import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { APIGetRequest, APIPostRequestWithoutCredentials } from '../../utils/APIRequest';
import { urlAPI } from '../../config';
import SubmitForm from '../../components/SubmitForm';

const AuthRoute = () => {

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(['client']);
    const [signInData, setSignInData] = useState(undefined);
    const [authenified, setAuthenified] = useState(false);
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
        if (signInData) {
            setCookie('admin', { value: signInData.jwt, haveAccount: true }, { path: '/' });
        }
        APIGetRequest({url: 'users/<id>/validation_jwt', setData: (e)=>e, setStatus:setStatusValidation})
    }, [signInData]);

    useEffect(() => {
        if (statusValidation.code === 200) {
            setAuthenified(true);
        } else if(statusValidation.code === 401) {
            setAuthenified(false);
        }
    }, [statusValidation]);

    if (authenified) {
        return <Outlet />;
    } else {
        return (
            <SubmitForm
          label="Login : "
          fieldsConfig={LoginConfig}
          onSubmit={handleLogin}
          message={signInStatus ? signInStatus.text : ''}
        />
        );
    }
};



export default AuthRoute;