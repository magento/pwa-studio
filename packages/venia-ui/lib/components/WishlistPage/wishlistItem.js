import React from 'react';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import Image from '../Image';
import defaultClasses from './wishlistItem.css';

const WishlistItem = props => {
    const { item } = props;

    const {
        child_sku: childSku,
        configurable_options: configurableOptions = [],
        product
    } = item;
    const { image, name, price_range: priceRange, sku } = product;

    const { label, url } = image;

    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const classes = mergeClasses(defaultClasses, props.classes);

    const optionElements = configurableOptions.map(option => {
        const {
            id,
            option_label: optionLabel,
            value_label: valueLabel
        } = option;

        return (
            <span
                className={classes.option}
                key={id}
            >{`${optionLabel} : ${valueLabel}`}</span>
        );
    });

    return (
        <div className={classes.root}>
            <Image
                alt={label}
                classes={{ image: classes.image }}
                src={url}
                width={400}
            />
            <span className={classes.name}>{name}</span>
            {optionElements}
            <div className={classes.priceContainer}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
        </div>
    );
};

export default WishlistItem;
