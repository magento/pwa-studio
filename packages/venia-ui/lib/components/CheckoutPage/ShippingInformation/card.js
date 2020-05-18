import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

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
                <span>{`${city}, ${region} ${postcode} ${country}`}</span>
            </div>
        </div>
    );
};

export default Card;

Card.propTypes = {
    classes: shape({
        root: string,
        address: string,
        area: string
    }),
    shippingData: shape({
        city: string.isRequired,
        country: shape({
            label: string.isRequired
        }).isRequired,
        email: string.isRequired,
        firstname: string.isRequired,
        lastname: string.isRequired,
        postcode: string.isRequired,
        region: shape({
            label: string.isRequired
        }).isRequired,
        street: arrayOf(string).isRequired,
        telephone: string.isRequired
    }).isRequired
};
