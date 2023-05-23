import React, { useEffect, useCallback, useState } from 'react';
import { useStyle } from '../../../classify';
import defaultClasses from './StoreCard.module.css';
import { useIntl } from 'react-intl';
import { ArrowRight } from 'react-feather';
import Icon from '../../Icon';
import { useStoreLocatorContext } from '../StoreLocatorProvider/StoreLocatorProvider';
import emptyStar from './assets/star.svg';
import fullStar from './assets/star-filled.svg';

const StoreCard = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { state_province: state, name, street, country, images, latitude, longitude, email } = props?.store;
    const [, setIsFavorite] = useState(false);
    const [lastSelectedStore, setLastSelectedStore] = useState(null);

    const { selectedLocation, handleSelectLocation, setLocationDetails } = props;

    const {
        setShowDirections,
        showDirections,
        setCenterCoordinates,
        setMapZoom,
        favoriteStores,
        setFavoriteStores
    } = useStoreLocatorContext();
    const storeImgParse = JSON.parse(images)[0]?.file;
    const { formatMessage } = useIntl();

    const locationText = formatMessage({
        id: 'storeLocator.getDirections',
        defaultMessage: 'Get directions'
    });

    const handleGetDirections = useCallback(() => {
        if (setLocationDetails) {
            setLocationDetails({ ...props?.store });
        }
        setShowDirections(!showDirections);
        setCenterCoordinates({
            lat: +latitude,
            lng: +longitude
        });
    }, [latitude, longitude, setCenterCoordinates, setShowDirections, showDirections, setLocationDetails, props]);

    const handleSetFavoriteStore = useCallback(
        (name, lat, lng) => {
            const newFavoriteStore = { name, lat, lng };
            setFavoriteStores(prevFavoriteStores => {
                const isCurrentStoreFavorite =
                    prevFavoriteStores.name === name &&
                    prevFavoriteStores.lat === lat &&
                    prevFavoriteStores.lng === lng;

                if (isCurrentStoreFavorite) {
                    setLastSelectedStore(null);
                    setMapZoom(1);
                    return {};
                } else {
                    setLastSelectedStore(newFavoriteStore);
                    setCenterCoordinates({
                        lat: +newFavoriteStore?.lat,
                        lng: +newFavoriteStore?.lng
                    });
                    return newFavoriteStore;
                }
            });
        },
        [setCenterCoordinates, setFavoriteStores, setMapZoom]
    );

    useEffect(() => {
        const storedFavoriteStores = favoriteStores;

        if (Object.keys(storedFavoriteStores).length === 0) {
            setIsFavorite(false);
            setLastSelectedStore(null);
            return;
        }
        const currentStore = { name, lat: latitude, lng: longitude };
        const isCurrentStoreFavorite =
            storedFavoriteStores.name === currentStore.name &&
            storedFavoriteStores.lat === currentStore.lat &&
            storedFavoriteStores.lng === currentStore.lng;
        setIsFavorite(isCurrentStoreFavorite);
        setMapZoom(8);
        if (isCurrentStoreFavorite) {
            setLastSelectedStore(currentStore);
        } else {
            setLastSelectedStore(null);
        }
    }, [name, latitude, longitude, setIsFavorite, setLastSelectedStore, favoriteStores, setMapZoom]);

    const isSelected =
        lastSelectedStore &&
        lastSelectedStore.name === name &&
        lastSelectedStore.lat === latitude &&
        lastSelectedStore.lng === longitude;

    const star = isSelected ? <img src={fullStar} alt="full star" /> : <img src={emptyStar} alt="empty star" />;
    const cardDetails = (
        <section className={`${classes.cardContainer} ${selectedLocation?.name === name && classes.selectedCard}`}>
            <button
                type="button"
                onClick={() => {
                    handleSelectLocation && handleSelectLocation(props?.store);
                }}
                className={classes.selectBtn}
            >
                <div className={classes.cardInnerContainer}>
                    <article className={classes.imageContainer}>
                        <img src={storeImgParse} alt={'store'} />
                    </article>
                    <article className={classes.cardInformation}>
                        <div className={classes.title}>
                            <div className={classes.name}>{name}</div>

                            <button
                                className={classes.star}
                                onClick={() => handleSetFavoriteStore(name, latitude, longitude)}
                            >
                                {star}
                            </button>
                        </div>
                        <p>{street}</p>
                        <p>
                            {state} <span>{country}</span>
                        </p>
                        <p>{email ? email : null}</p>
                    </article>
                </div>
            </button>
            <button className={classes.textContainer} onClick={handleGetDirections}>
                <p>{locationText}</p>
                <Icon src={ArrowRight} size={24} />
            </button>
        </section>
    );

    return <div>{cardDetails}</div>;
};

export default StoreCard;
