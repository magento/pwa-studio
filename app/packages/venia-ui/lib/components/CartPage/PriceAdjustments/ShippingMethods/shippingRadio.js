import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { number, string, shape } from 'prop-types';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../../classify';
import defaultClasses from './shippingRadio.module.css';

const ShippingRadio = props => {
    const priceElement = props.price ? (
        <Price value={props.price} currencyCode={props.currency} />
    ) : (
        <span>
            <FormattedMessage id={'global.free'} defaultMessage={'FREE'} />
        </span>
    );

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Fragment>
            <span data-cy="ShippingRadio-name">{props.name}</span>
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
