import React, { useMemo } from 'react';
import { string, func, arrayOf, shape, number } from 'prop-types';

import Item from './item';
import { mergeClasses } from '../../../classify';

import defaultClasses from './productList.css';

const ProductList = props => {
    const {
        items,
        handleRemoveItem,
        classes: propClasses,
        closeMiniCart
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const cartItems = useMemo(() => {
        if (items) {
            return items.map(item => (
                <Item
                    key={item.id}
                    {...item}
                    closeMiniCart={closeMiniCart}
                    handleRemoveItem={handleRemoveItem}
                />
            ));
        }
    }, [items, handleRemoveItem, closeMiniCart]);

    return <div className={classes.root}>{cartItems}</div>;
};

export default ProductList;

ProductList.propTypes = {
    classes: shape({ root: string }),
    items: arrayOf(
        shape({
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
            prices: shape({
                price: shape({
                    value: number,
                    currency: string
                })
            })
        })
    ),
    handleRemoveItem: func
};
