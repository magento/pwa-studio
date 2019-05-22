import React, { Fragment } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';

import ProductListFooter from './productListFooter';
import Product from './product';
import defaultClasses from './productList.css';

const ProductList = props => {
    const {
        beginEditItem,
        cart,
        currencyCode,
        isMiniCartMaskOpen,
        items,
        removeItemFromCart
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const currency = currencyCode || cart.details.currency.quote_currency_code;

    return (
        <Fragment>
            <List
                classes={classes}
                getItemKey={item => item.item_id}
                items={items}
                render="ul"
                renderItem={props => (
                    <Product
                        beginEditItem={beginEditItem}
                        currencyCode={currency}
                        removeItemFromCart={removeItemFromCart}
                        {...props}
                    />
                )}
            />
            <ProductListFooter
                cart={cart}
                isMiniCartMaskOpen={isMiniCartMaskOpen}
            />
        </Fragment>
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
    isMiniCartMaskOpen: bool,
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
