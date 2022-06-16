import React, { useCallback, useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './suggestedProduct.module.css';

import Button from '@magento/venia-ui/lib/components/Button';
import { useAddProduct } from '../../talons/AddProduct/useAddProduct';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce';

import { ShoppingBag as ShoppingCartIcon } from 'react-feather';

import { FormattedMessage } from 'react-intl';

const IMAGE_WIDTH = 60;

const SuggestedProduct = props => {
    const suggested_Product = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { url_key, small_image, name, onNavigate, price, url_suffix } = props;

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }, [onNavigate]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${url_suffix || ''}`), [
        url_key,
        url_suffix
    ]);

    const simpleProductLink = `/simple-product?sku=${suggested_Product.sku}`;

    const talonProps = useAddProduct({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        suggested_Product
    });

    const { handleAddToCart } = talonProps;

    return (
        <div className={classes.root}>
            <Link
                to={
                    suggested_Product.__typename === 'SimpleProduct'
                        ? simpleProductLink
                        : uri
                }
                onClick={handleClick}
            >
                <Image
                    alt={name}
                    classes={{ image: classes.thumbnail, root: classes.image }}
                    resource={small_image}
                    width={IMAGE_WIDTH}
                />
            </Link>
            <span className={classes.name}>{name}</span>
            {suggested_Product.__typename === 'SimpleProduct' ? (
                <Button
                    className={classes.addButton}
                    onClick={handleAddToCart}
                    priority="high"
                >
                    <FormattedMessage
                        id={'productFullDetail.cartAction'}
                        defaultMessage={'Add to Cart'}
                    />
                </Button>
            ) : null}

            {suggested_Product.__typename === 'SimpleProduct' ? (
                <Button
                    className={classes.addButtonMobile}
                    onClick={handleAddToCart}
                    priority="high"
                >
                    <Icon src={ShoppingCartIcon} />
                </Button>
            ) : null}

            <span className={classes.price}>
                <Price
                    currencyCode={
                        price.minimalPrice.amount.currency != null
                            ? price.minimalPrice.amount.currency
                            : price.regularPrice.amount.currency
                    }
                    value={
                        price.minimalPrice.amount.value != null
                            ? price.minimalPrice.amount.value
                            : price.regularPrice.amount.value
                    }
                />
            </span>
        </div>
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
