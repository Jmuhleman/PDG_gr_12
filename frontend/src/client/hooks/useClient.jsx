import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

class Client {
    haveAccount = false;
    value

    constructor(haveAccount, value) {
        this.haveAccount = haveAccount;
        this.value = value;
    }
}


const ClientContext = createContext(new Client(false, ""));
  
export function ClientProvider ({children}) {


    const [client, setClient] = useState(new Client(false, ""));

    return (
        <ClientContext.Provider value={{client:client, setClient:setClient}}>
            {children}
        </ClientContext.Provider>
    );
}

ClientProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


export function useClient() {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClient must be used within a ClientProvider');
    }
    return context;
}