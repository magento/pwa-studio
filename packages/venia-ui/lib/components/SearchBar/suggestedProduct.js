import React, { useCallback, useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import { mergeClasses } from '../../classify';
import { Link, resourceUrl } from '@magento/venia-drivers';

import defaultClasses from './suggestedProduct.css';

const PRODUCT_URL_SUFFIX = '.html';

const SuggestedProduct = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { url_key, small_image, name, onNavigate, price } = props;

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }, [onNavigate]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${PRODUCT_URL_SUFFIX}`), [
        url_key
    ]);

    const imageSource = useMemo(
        () =>
            resourceUrl(small_image, {
                type: 'image-product',
                width: 60
            }),
        [small_image]
    );

    return (
        <Link className={classes.root} to={uri} onClick={handleClick}>
            <span className={classes.image}>
                <img
                    alt={name}
                    className={classes.thumbnail}
                    src={imageSource}
                />
            </span>
            <span className={classes.name}>{name}</span>
            <span className={classes.price}>
                <Price
                    currencyCode={price.regularPrice.amount.currency}
                    value={price.regularPrice.amount.value}
                />
            </span>
        </Link>
    );
};

SuggestedProduct.propTypes = {
    url_key: string.isRequired,
    small_image: string.isRequired,
    name: string.isRequired,
    onNavigate: func,
    price: shape({
        regularPrice: shape({
            amount: shape({
                currency: string,
                value: number
            })
        })
    }).isRequired,
    classes: shape({
        root: string,
        image: string,
        name: string,
        price: string,
        thumbnail: string
    })
};

export default SuggestedProduct;
