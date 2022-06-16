import React, { useCallback, useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './suggestedProduct.module.css';

import { FormattedMessage } from 'react-intl';

const IMAGE_WIDTH = 60;

const SuggestedProduct = props => {
    const suggested_Product = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { orParentUrlKey, url_key, small_image, name, onNavigate, price, url_suffix } = props;

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate(props);
        }
    }, [onNavigate]);

    const uri = useMemo(() => resourceUrl(`/${orParentUrlKey || url_key}${url_suffix || ''}`), [
        orParentUrlKey,
        url_suffix
    ]);

    return (
        <>
            <div className={classes.root} onClick={handleClick} data-cy="SuggestedProduct-root">
                <Image
                    alt={name}
                    classes={{
                        image: classes.thumbnail,
                        root: classes.image
                    }}
                    resource={small_image}
                    width={IMAGE_WIDTH}
                    data-cy="SuggestedProduct-image"
                />
                <span className={classes.name}>{name}</span>
                <span data-cy="SuggestedProduct-price" className={classes.price}>
                    <Price currencyCode={price.regularPrice.amount.currency} value={price.regularPrice.amount.value} />
                </span>
            </div>
        </>
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
        }),
        minimalPrice: shape({
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
