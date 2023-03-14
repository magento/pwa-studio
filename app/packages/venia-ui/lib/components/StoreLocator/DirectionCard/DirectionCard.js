import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ArrowLeft, MapPin } from 'react-feather';
import Icon from '../../Icon';
import defaultClasses from './DirectionCard.module.css';
import { useStyle } from '../../../classify';
import { useStoreLocatorContext } from '../StoreLocatorProvider/StoreLocatorProvider';

const DirectionCard = props => {
    const { setShowDirections, showDirections, setCenterCoordinates, directionSteps } = useStoreLocatorContext();
    const { locationDetails } = props;
    const { formatMessage } = useIntl();
    const backText = formatMessage({
        id: 'notFound.goBack',
        defaultMessage: 'Go back'
    });
    const storeImgParse = JSON.parse(locationDetails?.images)[0]?.file;
    console.log({ locationDetails });

    const address = useMemo(() => {
        if (locationDetails) {
            const { street, city, country, state_province } = locationDetails;
            return street + ', ' + state_province + ' ' + city + ' ' + country;
        }
        return '';
    }, [locationDetails]);

    const noDirectionsText = formatMessage({
        id: 'noDirectionsText',
        defaultMessage: 'There is no directions for this location'
    });

    const classes = useStyle(defaultClasses, props.classes);
    const handleGoBack = useCallback(() => {
        setShowDirections(!showDirections);
        setCenterCoordinates({
            lat: 20.9790643,
            lng: 105.7854772
        });
    }, [setCenterCoordinates, setShowDirections, showDirections]);

    const steps = directionSteps?.steps;

    return (
        <section>
            <button className={classes.backContainer} onClick={handleGoBack}>
                <Icon src={ArrowLeft} size={24} />
                <article>{backText}</article>
            </button>
            <hr />
            <article className={classes.cardContainer}>
                <section className={classes.durationContainer}>
                    <span>{locationDetails?.name}</span>
                </section>

                {steps ? (
                    <ul className={classes.listContainer}>
                        {steps?.map((step, index) => {
                            const instructions = step?.instructions
                                .replace(/<\/?b>/g, '')
                                .replace(/<div\s+style="font-size:0.9em">.*?<\/div>/g, '')
                                .replace(/<wbr\s*\/?>/g, '');
                            return (
                                <li key={index}>
                                    <div className={classes.instructionsContainer}>
                                        <div className={classes.instructionsText}>
                                            <p>
                                                <span>{instructions}</span>
                                            </p>
                                        </div>

                                        <div className={classes.distanceContainer}>
                                            <p> {step?.distance?.text}</p>
                                        </div>
                                    </div>
                                    <hr />
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    noDirectionsText
                )}
                <span className={classes.addressText}>
                    <Icon src={MapPin} size={24} />
                    {address}
                </span>
                <div className={classes.imgWrapper}>

                <img src={storeImgParse} alt={'store'} />
                </div>
            </article>
        </section>
    );
};

export default DirectionCard;
