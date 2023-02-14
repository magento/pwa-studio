import React from 'react';
import GoogleMapReact from 'google-map-react';
import LocationPin from '../LocationPin/LocationPin';

const Map = ({ location, zoomLevel }) => {
    return (
        <div>
            <GoogleMapReact
                style={{ width: '100px' }}
                bootstrapURLKeys={{ key: process.env.GOOGLE_API_KEY }} // we have to create an env variable
                defaultCenter={location}
                defaultZoom={zoomLevel}
            >
                <LocationPin lat={location.lat} lng={location.lng} text={location.address} />
            </GoogleMapReact>
        </div>
    );
};

export default Map;
