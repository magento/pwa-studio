import React, { Fragment } from 'react';
import { number, string, shape } from 'prop-types';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../../classify';
import defaultClasses from './shippingRadio.css';
import { useIntl } from 'react-intl';

const ShippingRadio = props => {
    const { locale } = useIntl();
    const priceElement = props.price ? (
        <Price
            value={props.price}
            currencyCode={props.currency}
            locale={locale}
        />
    ) : (
        <span>FREE</span>
    );

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <span>{props.name}</span>
            <div className={classes.price}>{priceElement}</div>
        </Fragment>
    );
};

export default ShippingRadio;

ShippingRadio.propTypes = {
    classes: shape({
        price: string
    }),
    currency: string.isRequired,
    name: string.isRequired,
    price: number.isRequired
};
