import React from 'react';
import { Price } from '@magento/peregrine';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import classify from 'src/classify';

import defaultClasses from './suggestedProduct.css';

const productUrlSuffix = '.html';

const suggestedProduct = ({ classes, url_key, small_image, name, price }) => (
    <li className={classes.root}>
        <a href={`/${url_key}${productUrlSuffix}`}>
            <img
                className={classes.productImage}
                alt={name}
                src={makeProductMediaPath(small_image)}
            />
        </a>
        <a
            className={classes.productName}
            href={`/${url_key}${productUrlSuffix}`}
        >
            {name}
        </a>
        <a href={`/${url_key}${productUrlSuffix}`}>
            <Price
                currencyCode={price.regularPrice.amount.currency}
                value={price.regularPrice.amount.value}
            />
        </a>
    </li>
);

export default classify(defaultClasses)(suggestedProduct);
