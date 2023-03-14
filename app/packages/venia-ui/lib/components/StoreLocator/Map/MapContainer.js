import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useStyle } from '../../../classify';
import defaultClasses from './MapContainer.module.css';
import { useHistory } from 'react-router-dom';
import {
    GoogleMap,
    Marker,
    DirectionsService,
    DirectionsRenderer,
    InfoWindow,
    useLoadScript
} from '@react-google-maps/api';

import StoreCard from '../StoreCard/StoreCard';
import Pagination from '../../Pagination';
import DirectionCard from '../DirectionCard/DirectionCard';
import { useIntl } from 'react-intl';
import { MapPin, Menu, X as Close, Navigation } from 'react-feather';
import Icon from '../../Icon';
import SearchModal from '../SearchModal';
import LoadingIndicator from '../../LoadingIndicator';
import Search from '../Search/Search';
import Geocode from 'react-geocode';
import ErrorView from '../../ErrorView';

const MapContainer = props => {
    const { mapProps, ...rest } = props;

    const {
        locationsItems,
        pageControl,
        showDirections,
        centerCoordinates,
        directionsCallback,
        response,
        mapZoom,
        openSearchModal,
        setOpenSearchModal,
        submitSearch,
        formProps,
        setFormApi,
        resetSearch,
        locationsLoading,
        searchValue,
        setSearchValue,
        selectedLocation,
        setSelectedLocation
    } = mapProps;

    const history = useHistory();
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [markerPosition, setMarkerPosition] = useState({});

    const [storeInfo, setStoreInfo] = useState({});

    const classes = useStyle(defaultClasses, props.classes);
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    Geocode.setApiKey(googleApiKey);

    const containerStyle = {
        width: '100%',
        height: '562px'
    };
    const libraries = ['places'];
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleApiKey,
        libraries
    });

    const { formatMessage } = useIntl();

    const noStoresText = formatMessage({
        id: 'storeLocator.noStoresText',
        defaultMessage: 'There are no store available'
    });

    const findStoreText = formatMessage({
        id: 'storeLocator.findStoreText',
        defaultMessage: 'Find a store'
    });

    const findTextSubtitle = formatMessage({
        id: 'storeLocator.findText',
        defaultMessage: 'Find the nearest store to get your favorite stuff.'
    });

    const mapRef = React.useRef();
    const directionsServiceRef = React.useRef(null);
    const directionsRendererRef = React.useRef(null);

    const handleOpenInfoStoreDialogue = useCallback(
        (lat, lng, street, city, country, name) => {
            setMarkerPosition({ lat: lat, lng: lng });
            setOpenInfoDialog(!openInfoDialog);
            setStoreInfo({ street: street, city: city, country: country, name: name });
        },
        [openInfoDialog]
    );

    const getActualLocation = () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const success = async pos => {
            const crd = pos.coords;

            Geocode.fromLatLng(crd.latitude, crd.longitude).then(
                response => {
                    const address = response.results[0].formatted_address;
                    setSearchValue(address);
                },
                error => {
                    console.error(error);
                }
            );
        };

        const error = err => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    };

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

    useEffect(() => {
        if (directionsServiceRef.current) {
            directionsServiceRef.current = false;
        } else if (directionsRendererRef.current) {
            directionsRendererRef.current = false;
        }
    }, [centerCoordinates]);

    const onMapLoad = React.useCallback(map => {
        mapRef.current = map;
    }, []);

    const filteredLocationsItems = useMemo(() => {
        if (!searchValue) {
            return locationsItems;
        }

        return locationsItems.filter(
            item =>
                item.street.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.city.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.country.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [locationsItems, searchValue]);

    const cardContainer = (
        <section>
            {filteredLocationsItems?.length === 0 ? (
                <div className={classes.noStoresText}>
                    <p>{noStoresText}</p>
                </div>
            ) : (
                <>
                    <div className={classes.scrollableContainer}>
                        {filteredLocationsItems?.map((store, index) => (
                            <StoreCard
                                setLocationDetails={setSelectedLocation}
                                store={store}
                                key={`${store.latitude}-${store.longitude}-${index}`}
                                {...rest}
                            />
                        ))}
                    </div>
                    <Pagination pageControl={pageControl} />
                </>
            )}
        </section>
    );

    if (loadError) return <ErrorView />;
    if (!isLoaded) return <LoadingIndicator />;

    return (
        <main className={classes.container}>
            {history?.location.pathname === '/find-store' && (
                <>
                    <article className={classes.title}>{findStoreText}</article>
                    <article className={classes.subTitle}> {findTextSubtitle}</article>
                </>
            )}
            <section className={classes.innerContainer}>
                <article className={classes.cardContainer}>
                    {!showDirections && (
                        <div className={classes.searchBarWrapper}>
                            <button onClick={() => setOpenSearchModal(!openSearchModal)}>
                                <Icon src={!openSearchModal ? Menu : Close} />
                            </button>
                            <div className={classes.searchContainer}>
                                <Search />
                            </div>
                            <div className={classes.navigationContainer} onClick={() => getActualLocation()}>
                                <Icon src={Navigation} />
                            </div>
                        </div>
                    )}

                    {openSearchModal ? (
                        <SearchModal
                            submitSearch={submitSearch}
                            formProps={formProps}
                            setFormApi={setFormApi}
                            resetSearch={resetSearch}
                        />
                    ) : !showDirections ? (
                        locationsLoading ? (
                            <LoadingIndicator />
                        ) : (
                            cardContainer
                        )
                    ) : (
                        <div className={classes.scrollableContainerDirection}>
                            <DirectionCard locationDetails={selectedLocation} />
                        </div>
                    )}
                </article>
                <article className={classes.googleMapContainer}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={centerCoordinates}
                        zoom={mapZoom}
                        onLoad={onMapLoad}
                        loadScriptOptions={{
                            libraries: ['places']
                        }}
                    >
                        {filteredLocationsItems?.map((marker, index) => (
                            <Marker
                                key={`${marker.latitude}-${marker.longitude}-${index}`}
                                position={{ lat: +marker.latitude, lng: +marker.longitude }}
                                onClick={() =>
                                    handleOpenInfoStoreDialogue(
                                        +marker.latitude,
                                        +marker.longitude,
                                        marker.street,
                                        marker.city,
                                        marker.country,
                                        marker.name
                                    )
                                }
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
                        {openInfoDialog && (
                            <InfoWindow
                                position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                onCloseClick={() => setOpenInfoDialog(!openInfoDialog)}
                            >
                                <section className={classes.dialogInfoContainer}>
                                    <article className={classes.infoStoreName}>
                                        <p>{storeInfo.name}</p>
                                    </article>
                                    <section className={classes.dialogIconAndLocation}>
                                        <article className={classes.iconContainer}>
                                            <Icon src={MapPin} size={24} />
                                        </article>
                                        <div>
                                            <span>{storeInfo.street} </span>
                                            <span>{storeInfo.city} </span>
                                            <span>{storeInfo.country}</span>
                                        </div>
                                    </section>
                                </section>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </article>
            </section>
        </main>
    );
};

export default MapContainer;
