import React, { useCallback } from 'react';
import { string, number, shape, func, arrayOf } from 'prop-types';
import { Trash2 as DeleteIcon } from 'react-feather';

import { Price } from '@magento/peregrine';

import ProductOptions from '../../LegacyMiniCart/productOptions';
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
                className={classes.editButton}
                onClick={removeItem}
                type="button"
            >
                <Icon
                    size={16}
                    src={DeleteIcon}
                    classes={{ icon: classes.editIcon }}
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

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string
    }),
    product: shape({
        name: string,
        thumbnail: shape({
            url: string
        })
    }),
    id: string,
    quantity: number,
    configurable_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ),
    handleRemoveItem: func,
    prices: shape({
        price: shape({
            value: number,
            currency: string
        })
    })
};
