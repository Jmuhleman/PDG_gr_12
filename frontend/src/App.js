import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure the path is correct

function App() {
  const [message, setMessage] = useState('Pas de message');
  useEffect(() => {
      axios.get('http://127.0.0.1:5000/api/hello')
        .then(response => {
              setMessage(response.data.message);
          })
          .catch(error => {
              console.error('There was an error fetching the data!', error);
          });
  }, []);

  return (
      <div className="App">
          <header className="App-header">
              <h1>{message}</h1>
          </header>
      </div>
  );
}

export default App;
