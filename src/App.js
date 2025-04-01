import React, { useState } from 'react';
import MapComponent from './MapComponent';
import './App.css';
// app.js tiedosto, joka toimii sovelluksen pääkomponenttina
function App() {
    // state muuttuja hakusanalle
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="App">
            <header className="App-header">
                <h1>Junien Sijainnit</h1>
                {/* input kenttä junan numeron hakemiseen */}
                <input
                    type="text"
                    placeholder="Hae junan numerolla"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </header>
            {/* MapComponent, joka näyttää junien sijainnit kartalla */}
            <MapComponent searchTerm={searchTerm} />
        </div>
    );
}

export default App;
