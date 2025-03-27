import React, { useState } from 'react';
import MapComponent from './MapComponent';
import './App.css';

function App() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="App">
            <header className="App-header">
                <h1>Junien Sijainnit</h1>
                <input
                    type="text"
                    placeholder="Hae junan numerolla"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </header>
            <MapComponent searchTerm={searchTerm} />
        </div>
    );
}

export default App;
