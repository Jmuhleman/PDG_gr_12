import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { CookiesProvider } from 'react-cookie'
import './App.css'; // Ensure the path is correct
import { ClientProvider } from './client/hooks/useClient';
import BillingOverview from './client/Billing/BillingOverview';
import HomePage from './client/Home/HomePage';
import PaymentSuccess from './client/Billing/PaymentSuccess';
import Profile from './client/Profile/Profile';
import AdminHub from './admin/AdminHub/AdminHub';
import LogInOut from './admin/Log/LogInOut';
import Fares from './admin/fares/Fares';
import ByPlate from './admin/byPlate/ByPlate';

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
        path: "/admin",
        element: <Outlet />,
        children: [
            {
                path: "/admin",
                element: <AdminHub />,
            },
            {
                path: "/admin/fares",
                element: <Fares />,
            },
            {
                path: "/admin/log",
                element: <LogInOut />,
            },
            {
                path: "/admin/byPlate",
                element: <ByPlate />,
            }
        ],
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