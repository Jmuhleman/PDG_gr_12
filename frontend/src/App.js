import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { CookiesProvider } from 'react-cookie'
import './App.css'; // Ensure the path is correct
import { ClientProvider } from './client/hooks/useClient';
import BillingOverview from './client/Billing/BillingOverview';
import HomePage from './client/Home/HomePage';
import PaymentSuccess from './client/Billing/PaymentSuccess';
import Profile from './client/Profile/Profile';

const router = createBrowserRouter([
    {
        path: "/",
        element: <ClientProvider><Outlet /></ClientProvider>,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "billingOverview",
                element: <BillingOverview />,
            },
            {
                path: "billingSuccess",
                element: <PaymentSuccess />,
            },
            {
                path: "Profile",
                element: <Profile />,
            }
        ],
    },
    {
        path: "admin",
        element: <h1>Admin</h1>,
        children: [],
    },
]);

function App() {


    return (
        <CookiesProvider>
            <div className="App">
                <header className="App-header">
                </header>
                <RouterProvider 
                    router={router} 
                    fallbackElement={<h1>404</h1>}
                />
            </div>
        </CookiesProvider>
    );
}

export default App;