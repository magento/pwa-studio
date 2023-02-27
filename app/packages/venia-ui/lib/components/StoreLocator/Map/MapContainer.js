import React from 'react';
import { useStyle } from '../../../classify';
import defaultClasses from './MapContainer.module.css';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { useStoreLocatorContext } from '../StoreLocatorProvider/StoreLocatorProvider';
import StoreCard from '../StoreCard/StoreCard';
import Pagination from '../../Pagination';
import DirectionCard from '../DirectionCard/DirectionCard';

const MapContainer = props => {
    const {
        locationsItems,
        pageControl,
        showDirections,
        centerCoordinates,
        directionsCallback,
        response
    } = useStoreLocatorContext();

    const classes = useStyle(defaultClasses, props.classes);
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const containerStyle = {
        width: '100%',
        height: '500px'
    };

    const mapRef = React.useRef();
    const directionsServiceRef = React.useRef(null);
    const directionsRendererRef = React.useRef(null);

    const directionsOptions = React.useMemo(() => {
        return {
            destination: {
                lat: centerCoordinates.lat,
                lng: centerCoordinates.lng
            },
            origin: {
                lat: 20.9790646,
                lng: 105.7854776
            },
            travelMode: 'DRIVING'
        };
    }, [centerCoordinates]);

    const onMapLoad = React.useCallback(map => {
        mapRef.current = map;
    }, []);

    const cardContainer = (
        <section>
            <div className={classes.scrollableContainer}>
                {locationsItems?.map(store => (
                    <div>
                        <StoreCard store={store} key={`${store.latitude}-${store.longitude}`} />
                    </div>
                ))}
            </div>
            <Pagination pageControl={pageControl} />
        </section>
    );

    return (
        <LoadScript googleMapsApiKey={googleApiKey}>
            <main className={classes.container}>
                <section className={classes.innerContainer}>
                    <article className={classes.cardContainer}>
                        {!showDirections ? (
                            cardContainer
                        ) : (
                            <div className={classes.scrollableContainer}>
                                <DirectionCard />
                            </div>
                        )}
                    </article>
                    <article className={classes.googleMapContainer}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={centerCoordinates}
                            zoom={8}
                            onLoad={onMapLoad}
                        >
                            {locationsItems?.map(marker => (
                                <Marker
                                    key={`${marker.latitude}-${marker.longitude}`}
                                    position={{ lat: +marker.latitude, lng: +marker.longitude }}
                                    // onClick={() =>
                                    //   setSelected(marker);
                                    // }}
                                />
                            ))}

                            {showDirections && !directionsServiceRef.current && (
                                <DirectionsService
                                    options={directionsOptions}
                                    callback={directionsCallback}
                                    onLoad={service => {
                                        directionsServiceRef.current = service;
                                    }}
                                />
                            )}

                            {showDirections && response !== null && !directionsRendererRef.current && (
                                <DirectionsRenderer
                                    options={{
                                        directions: response
                                    }}
                                    onLoad={renderer => {
                                        directionsRendererRef.current = renderer;
                                    }}
                                />
                            )}
                        </GoogleMap>
                    </article>
                </section>
            </main>
        </LoadScript>
    );
};

export default MapContainer;
