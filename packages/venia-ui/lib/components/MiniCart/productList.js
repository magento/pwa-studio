import React, { useMemo } from 'react';
import { array, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';

import Product from './product';
import defaultClasses from './productList.css';

const ProductList = props => {
    const {
        beginEditItem,
        cartItems,
        currencyCode,
        removeItemFromCart
    } = props;

    const products = useMemo(
        () =>
            cartItems.map(product => {
                return (
                    <Product
                        beginEditItem={beginEditItem}
                        currencyCode={currencyCode}
                        item={product}
                        key={product.item_id}
                        removeItemFromCart={removeItemFromCart}
                    />
                );
            }),
        [beginEditItem, cartItems, currencyCode, removeItemFromCart]
    );

    const classes = mergeClasses(defaultClasses, props.classes);

    return <ul className={classes.root}>{products}</ul>;
};

ProductList.propTypes = {
    beginEditItem: func,
    cartItems: array,
    classes: shape({
        root: string
    }),
    currencyCode: string,
    removeItemFromCart: func
};

export default ProductList;
