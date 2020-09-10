import React, { useEffect } from 'react';
import { MoreHorizontal } from 'react-feather';
import { Price, useToasts } from '@magento/peregrine';
import { useWishlistItem } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItem';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import Image from '../Image';
import defaultClasses from './wishlistItem.css';
import wishlistItemOperations from './wishlistItem.gql';

const WishlistItem = props => {
    const { item } = props;

    const {
        child_sku: childSku,
        configurable_options: configurableOptions = [],
        product
    } = item;
    const { image, name, price_range: priceRange, sku } = product;

    const { label: imageLabel, url } = image;

    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const talonProps = useWishlistItem({
        childSku,
        sku,
        ...wishlistItemOperations
    });
    const {
        handleAddToCart,
        handleMoreActions,
        hasError,
        isLoading,
        labels
    } = talonProps;

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                message: labels.get('addToCartError'),
                timeout: 5000
            });
        }
    }, [addToast, hasError, labels]);

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
                alt={imageLabel}
                classes={{ image: classes.image }}
                src={url}
                width={400}
            />
            <span className={classes.name}>{name}</span>
            {optionElements}
            <div className={classes.priceContainer}>
                <Price currencyCode={currency} value={unitPrice} />
            </div>
            <div className={classes.actionsContainer}>
                <button
                    className={classes.addToCart}
                    disabled={isLoading}
                    onClick={handleAddToCart}
                >
                    {labels.get('addToCart')}
                </button>
                <button
                    className={classes.moreActions}
                    onClick={handleMoreActions}
                >
                    <Icon size={16} src={MoreHorizontal} />
                </button>
            </div>
        </div>
    );
};

export default WishlistItem;
