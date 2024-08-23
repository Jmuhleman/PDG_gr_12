
import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import App from './App.js';
import './index.css'; // Optional: Import any global styles


const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);