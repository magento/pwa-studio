import React, { Component } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import { Link, resourceUrl } from '@magento/venia-drivers';

import { generateSrcset } from '../../shared/images';
import classify from '../../classify';
import defaultClasses from './suggestedProduct.css';

const productUrlSuffix = '.html';

const width = 60;

class SuggestedProduct extends Component {
    static propTypes = {
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

    handleClick = () => {
        const { onNavigate } = this.props;

        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    };

    render() {
        const { handleClick, props } = this;
        const { classes, url_key, small_image, name, price } = props;

        const uri = resourceUrl(`/${url_key}${productUrlSuffix}`);
        const imageSrcset = generateSrcset(small_image, 'image-product');

        return (
            <Link className={classes.root} to={uri} onClick={handleClick}>
                <span className={classes.image}>
                    <img
                        alt={name}
                        className={classes.thumbnail}
                        src={resourceUrl(small_image, {
                            type: 'image-product',
                            width
                        })}
                        srcSet={imageSrcset}
                        sizes={`${width}px`}
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
    }
}

export default classify(defaultClasses)(SuggestedProduct);
