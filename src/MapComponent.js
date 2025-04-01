import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ searchTerm }) => {
    const [trainLocations, setTrainLocations] = React.useState([]);
    const [error, setError] = React.useState(false);

    useEffect(() => {
        const fetchTrainLocations = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTrainLocations(data);
                setError(false);
            } catch (error) {
                setError(true);
            }
        };

        fetchTrainLocations();
        const interval = setInterval(fetchTrainLocations, 30000); // update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const filteredTrains = trainLocations.filter(train =>
        train.trainNumber.toString().includes(searchTerm)
    );

    return (
        <div>
            {error ? (
                <p>Odotetaan yhteyttä...</p>
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
