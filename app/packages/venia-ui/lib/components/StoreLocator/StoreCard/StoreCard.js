import React, { useEffect, useCallback } from 'react';
import { useStyle } from '../../../classify';
import defaultClasses from './StoreCard.module.css';
import { useIntl } from 'react-intl';
import { ArrowRight } from 'react-feather';
import Icon from '../../Icon';
import { useStoreLocatorContext } from '../StoreLocatorProvider/StoreLocatorProvider';

const StoreCard = props => {
    const { state_province: state, name, street, country, images, latitude, longitude } = props?.store;

    const { setShowDirections, showDirections, setCenterCoordinates, centerCoordinates } = useStoreLocatorContext();

    const storeImgParse = JSON.parse(images)[0]?.file;
    const { formatMessage } = useIntl();

    const locationText = formatMessage({
        id: 'getDirections',
        defaultMessage: 'Get directions'
    });

    const handleGetDirections = useCallback(() => {
        setShowDirections(!showDirections);
        setCenterCoordinates({
            lat: +latitude,
            lng: +longitude
        });
    }, [latitude, longitude, setCenterCoordinates, setShowDirections, showDirections]);

    const classes = useStyle(defaultClasses, props.classes);

    const cardDetails = (
        <section className={classes.cardContainer}>
            <section className={classes.cardInnerContainer}>
                <article className={classes.imageContainer}>
                    <img src={storeImgParse} alt={'store'} />
                </article>
                <article className={classes.cardInformation}>
                    <p className={classes.title}>{name}</p>
                    <p>{street}</p>
                    <p>
                        {state} <span>{country}</span>
                    </p>
                </article>
            </section>
            <article className={classes.textContainer} onClick={handleGetDirections}>
                <p>{locationText}</p>
                <Icon src={ArrowRight} size={24} />
            </article>
        </section>
    );

    return <div>{cardDetails}</div>;
};

export default StoreCard;
