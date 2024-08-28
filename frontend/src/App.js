import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import './App.css'; // Ensure the path is correct
import { ClientProvider } from './client/hooks/useClient';
import BillingOverview from './client/Billing/BillingOverview';
import HomePage from './client/Home/HomePage';

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
                path: "billing_overview",
                element: <BillingOverview />,
            },
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
        <div className="App">
            <header className="App-header">
            </header>
            <RouterProvider 
                router={router} 
                fallbackElement={<h1>404</h1>}
            />
        </div>
    );
}

export default App;