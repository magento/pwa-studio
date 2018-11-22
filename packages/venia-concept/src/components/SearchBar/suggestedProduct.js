import React from 'react';
import { Price } from '@magento/peregrine';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import classify from 'src/classify';
import { Link } from 'react-router-dom';

import defaultClasses from './suggestedProduct.css';

const productUrlSuffix = '.html';

const suggestedProduct = ({
    handleOnProductOpen,
    classes,
    url_key,
    small_image,
    name,
    price
}) => (
    <li className={classes.root}>
        <Link
            onClick={handleOnProductOpen}
            to={`/${url_key}${productUrlSuffix}`}
        >
            <img
                className={classes.productImage}
                alt={name}
                src={makeProductMediaPath(small_image)}
            />
        </Link>
        <Link
            onClick={handleOnProductOpen}
            className={classes.productName}
            to={`/${url_key}${productUrlSuffix}`}
        >
            {name}
        </Link>
        <Link
            onClick={handleOnProductOpen}
            to={`/${url_key}${productUrlSuffix}`}
        >
            <Price
                currencyCode={price.regularPrice.amount.currency}
                value={price.regularPrice.amount.value}
            />
        </Link>
    </li>
);

export default classify(defaultClasses)(suggestedProduct);
