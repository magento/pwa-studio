import React, { useEffect, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ArrowLeft } from 'react-feather';
import Icon from '../../Icon';
import defaultClasses from './DirectionCard.module.css';
import { useStyle } from '../../../classify';
import { useStoreLocatorContext } from '../StoreLocatorProvider/StoreLocatorProvider';

const DirectionCard = props => {
    const { setShowDirections, showDirections, setCenterCoordinates, directionSteps } = useStoreLocatorContext();

    const { formatMessage } = useIntl();
    const backText = formatMessage({
        id: 'goBack',
        defaultMessage: 'Go back'
    });

    const aboutText = formatMessage({
        id: 'aboutText',
        defaultMessage: 'About'
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
            <section className={classes.backContainer} onClick={handleGoBack}>
                <Icon src={ArrowLeft} size={24} />
                <article>{backText}</article>
            </section>
            <hr />
            <article className={classes.cardContainer}>
                <section className={classes.durationContainer}>
                    <span>{directionSteps?.distance?.text}</span>
                    <span> {aboutText} </span>
                    <span> {directionSteps?.duration?.text} </span>
                    <hr />
                </section>
                <article>
                    {steps?.map((step, index) => {
                        const instructions = step?.instructions
                            .replace(/<\/?b>/g, '')
                            .replace(/<div\s+style="font-size:0.9em">.*?<\/div>/g, '')
                            .replace(/<wbr\s*\/?>/g, '');
                        return (
                            <div key={index}>
                                <div className={classes.instructionsContainer}>
                                    <div className={classes.instructionsText}>
                                        <p>
                                            {index + 1}. <span>{instructions}</span>
                                        </p>
                                    </div>

                                    <div className={classes.distanceContainer}>
                                        <p> {step?.distance?.text}</p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        );
                    })}
                </article>
            </article>
        </section>
    );
};

export default DirectionCard;
