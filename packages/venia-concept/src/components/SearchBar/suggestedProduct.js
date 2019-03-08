import React, { Component } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { Link, resourceUrl } from 'src/drivers';

import defaultClasses from './suggestedProduct.css';

const productUrlSuffix = '.html';

class SuggestedProduct extends Component {
    static propTypes = {
        handleOnProductOpen: func.isRequired,
        url_key: string.isRequired,
        small_image: string.isRequired,
        name: string.isRequired,
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
            productName: string,
            productImage: string
        })
    };

    render() {
        const {
            handleOnProductOpen,
            classes,
            url_key,
            small_image,
            name,
            price
        } = this.props;

        const productLink = resourceUrl(`/${url_key}${productUrlSuffix}`);

        return (
            <li className={classes.root}>
                <Link onClick={handleOnProductOpen} to={productLink}>
                    <img
                        className={classes.productImage}
                        alt={name}
                        src={resourceUrl(small_image, {
                            type: 'image-product',
                            width: 60
                        })}
                    />
                </Link>
                <Link
                    onClick={handleOnProductOpen}
                    className={classes.productName}
                    to={productLink}
                >
                    {name}
                </Link>
                <Link onClick={handleOnProductOpen} to={productLink}>
                    <Price
                        currencyCode={price.regularPrice.amount.currency}
                        value={price.regularPrice.amount.value}
                    />
                </Link>
            </li>
        );
    }
}

export default classify(defaultClasses)(SuggestedProduct);
