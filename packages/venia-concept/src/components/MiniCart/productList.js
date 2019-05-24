import React from 'react';
import { arrayOf, func, number, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';

import Product from './product';
import defaultClasses from './productList.css';

const ProductList = props => {
    const {
        beginEditItem,
        cart,
        currencyCode,
        items,
        removeItemFromCart
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const currency = currencyCode || cart.details.currency.quote_currency_code;

    return (
        <List
            classes={classes}
            getItemKey={item => item.item_id}
            items={items}
            render="ul"
            renderItem={props => {
                return (
                    <Product
                        beginEditItem={beginEditItem}
                        currencyCode={currency}
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
    cart: shape({
        details: shape({
            currency: shape({
                quote_currency_code: string
            }).isRequired
        }).isRequired
    }).isRequired,
    classes: shape({
        root: string
    }),
    currencyCode: string,
    items: arrayOf(
        shape({
            item_id: number,
            name: string,
            price: number,
            product_type: string,
            qty: number,
            quote_id: string,
            sku: string
        })
    ),
    removeItemFromCart: func
};

export default ProductList;
