import React, { useCallback, useMemo, useState } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '../Price';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import Image from '../Image';
import defaultClasses from './suggestedProduct.module.css';

import Button from '@magento/venia-ui/lib/components/Button';
import { useAddProduct } from '@magento/peregrine/lib/talons/AddProduct/useAddProduct';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce';

import { ShoppingBag as ShoppingCartIcon } from 'react-feather';

import { FormattedMessage } from 'react-intl';

import copyToClipboard from './Icons/copyToClipboard.png';

const IMAGE_WIDTH = 60;

const SuggestedProduct = props => {
    const suggested_Product = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { url_key, small_image, name, onNavigate, price, url_suffix, sku } = props;

    const [copied, setCopied] = useState(false);

    const copyText = () => {
        navigator.clipboard.writeText(sku);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }, [onNavigate]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${url_suffix || ''}`), [url_key, url_suffix]);

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
                to={suggested_Product.__typename === 'SimpleProduct' ? simpleProductLink : uri}
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
            </Link>
            <span className={classes.name}>{name}</span>
            <span data-cy="SuggestedProduct-price" className={classes.sku}>
                {copied ? (
                    <span className={classes.copiedText}>
                        <FormattedMessage id={'productFullDetailB2B.copiedText'} defaultMessage={'Copied'} />
                    </span>
                ) : (
                    <div className={classes.productSkuContainer}>
                        <a onClick={copyText}>{sku.length > 6 ? '...' + sku.substring(sku.length - 6) : sku}</a>
                        <img src={copyToClipboard} alt="copyToClipboard" onClick={copyText} />
                    </div>
                )}
            </span>
            {suggested_Product.__typename === 'SimpleProduct' ? (
                <Button
                    className={classes.addButton}
                    onClick={handleAddToCart}
                    disabled={price?.minimalPrice?.amount?.value === -1 || price?.regularPrice?.amount?.value === -1}
                >
                    <FormattedMessage id={'productFullDetail.cartAction'} defaultMessage={'Add to Cart'} />
                </Button>
            ) : null}

            {suggested_Product.__typename === 'SimpleProduct' ? (
                <Button
                    className={classes.addButtonMobile}
                    onClick={handleAddToCart}
                    disabled={price?.minimalPrice?.amount?.value === -1 || price?.regularPrice?.amount?.value === -1}
                >
                    <Icon
                        src={ShoppingCartIcon}
                        size={16}
                        classes={{
                            icon: classes.buttonAddToCartIcon
                        }}
                    />
                </Button>
            ) : null}
            {suggested_Product.__typename !== 'SimpleProduct' && <div className={classes.hideMobile} />}
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
