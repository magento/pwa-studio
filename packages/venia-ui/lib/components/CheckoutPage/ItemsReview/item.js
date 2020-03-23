import React from 'react';

import ProductOptions from '../../MiniCart/productOptions';
import Image from '../../Image';
import { mergeClasses } from '../../../classify';

import defaultClasses from './itemsReview.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <div className={classes.item_root}>
            <Image
                alt={product.name}
                classes={{ root: classes.item_thumbnail }}
                width={100}
                resource={product.thumbnail.url}
            />
            <span className={classes.item_name}>{product.name}</span>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.item_options
                }}
            />
            <span className={classes.item_quantity}>{`Qty: ${quantity}`}</span>
        </div>
    );
};

export default Item;
