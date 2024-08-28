import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';


const ClientContext = createContext({ haveAccount:false, value: "" });
  
export function ClientProvider ({children}) {


    const [client, setClient] = useState({ haveAccount:false, value: "" });

    return (
        <ClientContext.Provider value={{ client, setClient }}>
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