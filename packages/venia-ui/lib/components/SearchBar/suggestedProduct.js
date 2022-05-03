import React, { useCallback, useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '../../classify';

import Image from '../Image';
import defaultClasses from './suggestedProduct.module.css';

const IMAGE_WIDTH = 60;

const SuggestedProduct = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        url_key,
        small_image,
        name,
        onNavigate,
        price,
        price_range,
        url_suffix
    } = props;

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }, [onNavigate]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${url_suffix || ''}`), [
        url_key,
        url_suffix
    ]);

    // fall back to deprecated field if price range is unavailable
    const priceProps = {
        currencyCode:
            price_range?.maximum_price?.final_price?.currency ||
            price.regularPrice.amount.currency,
        value:
            price_range?.maximum_price?.final_price?.value ||
            price.regularPrice.amount.value
    };

    return (
        <Link
            className={classes.root}
            to={uri}
            onClick={handleClick}
            data-cy="SuggestedProduct-root"
        >
            <Image
                alt={name}
                classes={{ image: classes.thumbnail, root: classes.image }}
                resource={small_image}
                width={IMAGE_WIDTH}
                data-cy="SuggestedProduct-image"
            />
            <span className={classes.name}>{name}</span>
            <span data-cy="SuggestedProduct-price" className={classes.price}>
                <Price {...priceProps} />
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
    price_range: shape({
        maximum_price: shape({
            final_price: shape({
                currency: string,
                value: number
            })
        })
    }),
    classes: shape({
        root: string,
        image: string,
        name: string,
        price: string,
        thumbnail: string
    })
};

export default SuggestedProduct;
