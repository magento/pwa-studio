import React from 'react';

import { mergeClasses } from '../../../classify';
import defaultClasses from './card.css';

const Card = props => {
    const { classes: propClasses, shippingData } = props;
    const {
        city,
        country: { label: country },
        email,
        firstname,
        lastname,
        postcode,
        region: { label: region },
        street,
        telephone
    } = shippingData;

    const streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <span>{email}</span>
            <span>{`${firstname} ${lastname}`}</span>
            <span>{telephone}</span>
            <div className={classes.address}>
                {streetRows}
                <span
                    className={classes.area}
                >{`${city}, ${region} ${postcode} ${country}`}</span>
            </div>
        </div>
    );
};

export default Card;
