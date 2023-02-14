import React from 'react';
import GoogleMapReact from 'google-map-react';
import LocationPin from '../LocationPin/LocationPin';

import { useStyle } from '../../../classify';
import defaultClasses from './Map.module.css';

const Map = props => {
    const { location, zoomLevel } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const googleApiKey = process.env.GOOGLE_API_KEY;

    return (
        <div className={classes.googleMapContainer}>
            <article>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: googleApiKey }} // we have to create an env variable
                    defaultCenter={location}
                    defaultZoom={zoomLevel}
                >
                    <LocationPin lat={location.lat} lng={location.lng} text={location.address} />
                </GoogleMapReact>
            </article>
        </div>
    );
};

export default Map;
