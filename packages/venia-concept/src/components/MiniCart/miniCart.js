import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { shape, string, bool } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import { getCartDetails } from 'src/actions/cart';
import Icon from 'src/components/Icon';
import EmptyMiniCart from './emptyMiniCart';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';
import { isEmptyCartVisible } from 'src/selectors/cart';

let Checkout = () => null;

class MiniCart extends Component {
    static propTypes = {
        classes: shape({
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
        }),
        isCartEmpty: bool
    };

    async componentDidMount() {
        const { getCartDetails } = this.props;

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

    get miniCartInner() {
        const { productList, totalsSummary, props } = this;
        const { isCartEmpty, classes, cart } = props;

        if (isCartEmpty) {
            return <EmptyMiniCart />;
        }

        return (
            <Fragment>
                <div className={classes.body}>{productList}</div>
                <div className={classes.footer}>
                    <div className={classes.summary}>{totalsSummary}</div>
                </div>
                <Checkout cart={cart} />
            </Fragment>
        );
    }

    render() {
        if (this.props.loading) {
            return <div>Fetching Data</div>;
        }

        const { miniCartInner } = this;
        const { classes, isOpen } = this.props;
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
                {miniCartInner}
            </aside>
        );
    }
}

const mapStateToProps = state => {
    const { cart } = state;
    const details = cart && cart.details;
    const cartId = details && details.id;
    const cartCurrencyCode =
        details && details.currency && details.currency.quote_currency_code;

    return {
        cart,
        cartId,
        cartCurrencyCode,
        isCartEmpty: isEmptyCartVisible(state)
    };
};

const mapDispatchToProps = { getCartDetails };

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MiniCart);
