import React, { useCallback, useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import { mergeClasses } from '../../classify';
import { Link, resourceUrl } from '@magento/venia-drivers';

import { Image, UNCONSTRAINED_SIZE_KEY } from '../Image';
import defaultClasses from './suggestedProduct.css';

const PRODUCT_URL_SUFFIX = '.html';
const IMAGE_WIDTHS = new Map().set(UNCONSTRAINED_SIZE_KEY, 60);

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

    return (
        <Link className={classes.root} to={uri} onClick={handleClick}>
            <Image
                alt={name}
                classes={{ image: classes.thumbnail, root: classes.image }}
                resource={small_image}
                widths={IMAGE_WIDTHS}
            />
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
