import React, { useCallback } from 'react';
import { Trash2 as DeleteIcon } from 'react-feather';

import { Price } from '@magento/peregrine';

import ProductOptions from '../../MiniCart/productOptions';
import Image from '../../Image';
import Icon from '../../Icon';
import { mergeClasses } from '../../../classify';

import defaultClasses from './item.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        id,
        quantity,
        configurable_options,
        handleRemoveItem,
        prices
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const removeItem = useCallback(() => {
        handleRemoveItem(id);
    }, [handleRemoveItem, id]);

    return (
        <div className={classes.root}>
            <Image
                alt={product.name}
                classes={{ root: classes.thumbnail }}
                width={100}
                resource={product.thumbnail.url}
            />
            <span className={classes.name}>{product.name}</span>
            <button
                className={classes.edit_button}
                onClick={removeItem}
                type="button"
            >
                <Icon
                    size={16}
                    src={DeleteIcon}
                    classes={{ icon: classes.edit_icon }}
                />
            </button>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>{`Qty : ${quantity}`}</span>
            <span className={classes.price}>
                <Price
                    currencyCode={prices.price.currency}
                    value={prices.price.value}
                />
                {' ea.'}
            </span>
        </div>
    );
};

export default Item;
