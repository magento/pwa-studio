import React, { Component, Fragment } from 'react';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import ProductListFooter from './productListFooter';
import Product from './product';
import defaultClasses from './productList.css';

class ProductList extends Component {
    static propTypes = {
        beginEditItem: func,
        cart: shape({
            details: shape({
                currency: shape({
                    quote_currency_code: string
                })
            })
        }),
        classes: shape({
            root: string
        }),
        currencyCode: string,
        isMiniCartMaskOpen: bool,
        items: arrayOf(
            shape({
                item_id: number.isRequired,
                name: string.isRequired,
                price: number.isRequired,
                product_type: string,
                qty: number.isRequired,
                quote_id: string,
                sku: string.isRequired
            })
        ).isRequired,
        removeItemFromCart: func
    };

    render() {
        const {
            beginEditItem,
            cart,
            currencyCode,
            isMiniCartMaskOpen,
            removeItemFromCart,
            totalsItems,
            ...otherProps
        } = this.props;

        const currency = currencyCode || cart.details.currency.quote_currency_code;

        return (
            <Fragment>
                <List
                    render="ul"
                    getItemKey={item => item.item_id}
                    renderItem={props => (
                        <Product
                            beginEditItem={beginEditItem}
                            currencyCode={currency}
                            removeItemFromCart={removeItemFromCart}
                            totalsItems={totalsItems}
                            {...props}
                        />
                    )}
                    {...otherProps}
                />
                <ProductListFooter
                    cart={cart}
                    isMiniCartMaskOpen={isMiniCartMaskOpen}
                />
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(ProductList);
