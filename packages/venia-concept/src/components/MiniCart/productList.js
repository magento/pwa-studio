import React from 'react';
import { array, func, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';

import Product from './product';
import defaultClasses from './productList.css';

const ProductList = props => {
    const {
        beginEditItem,
        cartItems,
        currencyCode,
        removeItemFromCart
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <List
            classes={classes}
            getItemKey={item => item.item_id}
            items={cartItems}
            render="ul"
            renderItem={props => {
                return (
                    <Product
                        beginEditItem={beginEditItem}
                        currencyCode={currencyCode}
                        item={props.item}
                        removeItemFromCart={removeItemFromCart}
                    />
                );
            }}
        />
    );
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
