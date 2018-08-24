import { Component, createElement } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { shape, string } from 'prop-types';
import Subtotal from 'src/components/Subtotal';

import { store } from 'src';
import { getCartDetails } from 'src/actions/cart';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';

let Checkout;

class MiniCart extends Component {
    static propTypes = {
        classes: shape({
            checkout: string,
            body: string,
            header: string,
            footer: string,
            root: string,
            root_open: string,
            subtotalLabel: string,
            subtotalValue: string,
            summary: string,
            title: string,
            totals: string
        })
    };

    constructor(...args) {
        super(...args);
    }

    async componentDidMount() {
        const [
            CheckoutComponent,
            checkoutReducer,
            makeCartReducer
        ] = (await Promise.all([
            import('src/components/Checkout'),
            import('src/reducers/checkout'),
            import('src/reducers/cart')
        ])).map(mod => mod.default);

        Checkout = CheckoutComponent;
        store.addReducer('checkout', checkoutReducer);
        store.addReducer('cart', await makeCartReducer());
        this.props.getCartDetails({
            guestCartId: store.getState().cart.guestCartId
        });
    }

    get checkout() {
        return Checkout ? <Checkout /> : null;
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
        const { cartId, cartCurrencyCode, cart } = this.props;
        return cartId && cart.totals && 'subtotal' in cart.totals ? (
            <Subtotal
                items_qty={cart.details.items_qty}
                currencyCode={cartCurrencyCode}
                subtotal={cart.totals.subtotal} />
        ) : null;
    }

    render() {
        if (this.props.loading) {
            return <div>Fetching Data</div>;
        }

        const { checkout, productList, totalsSummary, props } = this;
        const { classes, isOpen } = props;
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
                {checkout}
            </aside>
        );
    }
}

export default compose(
    classify(defaultClasses),
    connect(
        ({ cart }) => {
            const details = cart && cart.details;
            const cartId = details && details.id;
            const cartCurrencyCode =
                details &&
                details.currency &&
                details.currency.quote_currency_code;
            return {
                cart,
                cartId,
                cartCurrencyCode
            };
        },
        { getCartDetails }
    )
)(MiniCart);
