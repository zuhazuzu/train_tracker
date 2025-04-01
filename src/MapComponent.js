import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// MapComponent käyttää Leaflet-kirjastoa junien sijaintien näyttämiseen kartalla
const MapComponent = ({ searchTerm }) => {
    const [trainLocations, setTrainLocations] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    // Käytetään useEffectiä junien sijaintien hakemiseen API:sta
    // Komponentti lataa junien sijainnit kerran ja päivittää ne 30sekunin välein
    useEffect(() => {
        const fetchTrainLocations = async () => {
            setLoading(true); // Näytetään latausilmoitus
            setError(false); // Nollataan virhetila ennen uuden haun aloittamista
            try {
                const response = await fetch(process.env.REACT_APP_API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTrainLocations(data); // Asetetaan saatu data tilaan
                setError(false); // Nollataan virhetila, jos haku onnistuu
            } catch (error) {
                setError(true); // Asetetaan virhetila, jos haku epäonnistuu
            } finally {
                setLoading(false); // Nollataan latausilmoitus riippumatta siitä, onnistuiko haku vai ei
            }
        };

        fetchTrainLocations();
        const interval = setInterval(fetchTrainLocations, 30000); // Päivittää joka 30 sekunti
        return () => clearInterval(interval); // puhdistetaan interval komponentin purkamisessa
    }, []);

    // suodatetaan junat numeron perusteella, joka on annettu hakukentässä
    // käytetään useMemoia suorituskyvyn parantamiseksi, jotta suodatus ei tapahdu joka renderöinnissä
    const filteredTrains = useMemo(() => 
        trainLocations.filter(train =>
            train.trainNumber.toString().includes(searchTerm)
        ), [trainLocations, searchTerm]);

    return (
        <div>
            {loading && <p>Ladataan...</p>} {/* Näytetään latausilmoitus, kun dataa ladataan */}
            {error ? (
                <p>Odotetaan yhteyttä...</p> // Näytetään virheilmoitus, jos haku epäonnistuu tai yhteyttä ei saada
            ) : (
                <MapContainer center={[60.1699, 24.9384]} zoom={7} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {filteredTrains.map(train => {
                        const position = [train.location.coordinates[1], train.location.coordinates[0]];

                        // Luodaan mukautettu ikoni, jossa näkyy junan numero
                        const trainLabelIcon = L.divIcon({
                            html: `<div style="display: flex; align-items: center;">
                                        <img src="/train-icon.png" width="25" height="25" style="margin-right: 4px;" />
                                        <span style="background: white; padding: 2px 4px; border-radius: 4px; font-size: 12px;">
                                            ${train.trainNumber}
                                        </span>
                                   </div>`,
                            className: "", // poistaa oletustyylit
                            iconAnchor: [12, 12]
                        });
                        // Asetetaan junan sijainti ja mukautettu ikoni kartalle
                        // Käytetään junan sijaintia ja numeroa ikonin luomiseen
                        return (
                            <Marker key={train.trainNumber} position={position} icon={trainLabelIcon}>
                                <Popup>
                                    Juna: {train.trainNumber}<br />
                                    Nopeus: {train.speed} km/h
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            )}
        </div>
    );
};

export default MapComponent;
