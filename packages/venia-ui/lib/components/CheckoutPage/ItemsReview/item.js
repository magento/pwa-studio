import React from 'react';

import ProductOptions from '../../MiniCart/productOptions';
import Image from '../../Image';
import { mergeClasses } from '../../../classify';

import defaultClasses from './item.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root;

    return (
        <div className={className}>
            <Image
                alt={product.name}
                classes={{ root: classes.thumbnail }}
                width={100}
                resource={product.thumbnail.url}
            />
            <span className={classes.name}>{product.name}</span>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>{`Qty : ${quantity}`}</span>
        </div>
    );
};

export default Item;
