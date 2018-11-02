import React, { Component } from 'react';
import { Price } from '@magento/peregrine';
import Button from 'src/components/Button';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import { addReducer } from 'src/store';
import Icon from 'src/components/Icon';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';
import ProductEdit from 'src/components/ProductEdit';

let Checkout = () => null;

class MiniCart extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            body: PropTypes.string,
            header: PropTypes.string,
            footer: PropTypes.string,
            root: PropTypes.string,
            root_open: PropTypes.string,
            subtotalLabel: PropTypes.string,
            subtotalValue: PropTypes.string,
            summary: PropTypes.string,
            title: PropTypes.string,
            totals: PropTypes.string
        }),
        getCartDetails: PropTypes.func
    };

    constructor(...args) {
        super(...args);
    }

    async componentDidMount() {
        const { getCartDetails } = this.props;
        const reducers = await Promise.all([
            import('src/reducers/cart'),
            import('src/reducers/checkout')
        ]);

        reducers.forEach(mod => {
            addReducer(mod.name, mod.default);
        });
        await getCartDetails();

        const CheckoutModule = await import('src/components/Checkout');
        Checkout = CheckoutModule.default;
    }

    get productList() {
        const { cartId, cartCurrencyCode, cart } = this.props;
        return cartId ? (
            <ProductList
                currencyCode={cartCurrencyCode}
                items={cart.details.items}
            />
        ) : null;
    }

    get totalsSummary() {
        const { cartId, cartCurrencyCode, cart, classes } = this.props;
        return cartId && cart.totals && 'subtotal' in cart.totals ? (
            <dl className={classes.totals}>
                <dt className={classes.subtotalLabel}>
                    <span>
                        Subtotal
                        {` (${cart.details.items_qty} Items)`}
                    </span>
                </dt>
                <dd className={classes.subtotalValue}>
                    <Price
                        currencyCode={cartCurrencyCode}
                        value={cart.totals.subtotal}
                    />
                </dd>
            </dl>
        ) : null;
    }

    render() {
        if (this.props.loading) {
            return <div>Fetching Data</div>;
        }

        const { productList, totalsSummary, props } = this;
        const { cart, classes, isOpen } = props;
        const className = isOpen ? classes.root_open : classes.root;

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>Shopping Cart</span>
                    </h2>
                    <Trigger>
                        <Icon name="x" />
                    </Trigger>
                </div>
                <div className={classes.body}>{productList}</div>
                <div className={classes.footer}>
                    <div className={classes.summary}>{totalsSummary}</div>
                </div>
                <Checkout cart={cart} />
            </aside>
        );
    }
}

export default classify(defaultClasses)(MiniCart);
