import React, { Fragment } from 'react';
import { Price } from '@magento/peregrine';

const ShippingRadio = props => {
    const priceElement = props.price ? (
        <Price value={props.price} currencyCode={props.currency} />
    ) : (
        <span>FREE</span>
    );

    return (
        <Fragment>
            <span>{props.name}</span>
            <div>{priceElement}</div>
        </Fragment>
    );
};

export default ShippingRadio;
