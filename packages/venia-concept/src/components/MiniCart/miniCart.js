import React, { Component, Fragment, Suspense } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { bool, object, shape, string } from 'prop-types';

import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { getCartDetails, updateItemInCart, removeItemFromCart } from 'src/actions/cart';
import Icon from 'src/components/Icon';
import Button from 'src/components/Button';
import CheckoutButton from 'src/components/Checkout/checkoutButton';
import EmptyMiniCart from './emptyMiniCart';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';
import { isEmptyCartVisible } from 'src/selectors/cart';

import EditMenu from './editMenu';

const Checkout = React.lazy(() => import('src/components/Checkout'));

class MiniCart extends Component {
    static propTypes = {
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }),
        classes: shape({
            body: string,
            footer: string,
            header: string,
            placeholderButton: string,
            root_open: string,
            root: string,
            subtotalLabel: string,
            subtotalValue: string,
            summary: string,
            title: string,
            totals: string
        }),
        isCartEmpty: bool
    };

    constructor(...args) {
        super(...args);
        this.state = {
            isEditPanelOpen: false,
            focusItem: null
        };
    }

    async componentDidMount() {
        const { getCartDetails } = this.props;
        await getCartDetails();
    }

    get cartId() {
        const { cart } = this.props;

        return cart && cart.details && cart.details.id;
    }

    get cartCurrencyCode() {
        const { cart } = this.props;

        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    get productList() {
        const { cart, removeItemFromCart } = this.props;

        const { cartCurrencyCode, cartId } = this;

        return cartId ? (
            <ProductList
                removeItemFromCart={removeItemFromCart}
                showEditPanel={this.showEditPanel}
                currencyCode={cartCurrencyCode}
                items={cart.details.items}
                totalsItems={cart.totals.items}
            />
        ) : null;
    }

    get totalsSummary() {
        const { cart, classes } = this.props;
        const { cartCurrencyCode, cartId } = this;
        const hasSubtotal = cartId && cart.totals && 'subtotal' in cart.totals;

        return hasSubtotal ? (
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

    get placeholderButton() {
        const { classes } = this.props;
        return (
            <div className={classes.placeholderButton}>
                <CheckoutButton ready={false} />
            </div>
        );
    }

    get checkout() {
        const { props, totalsSummary, placeholderButton } = this;
        const { classes, cart } = props;

        return (
            <div>
                <div className={classes.summary}>{totalsSummary}</div>
                <Suspense fallback={placeholderButton}>
                    <Checkout cart={cart} />
                </Suspense>
            </div>
        );
    }

    get productOptions() {
        const { props, state, hideEditPanel } = this;
        const { updateItemInCart } = props;
        const { focusItem } = state;

        return (
            <Fragment>
                <EditMenu
                    item={focusItem}
                    hideEditPanel={hideEditPanel}
                    updateCart={updateItemInCart}
                />

            </Fragment>
        );
    }

    showEditPanel = item => {
        this.setState({
            isEditPanelOpen: true,
            focusItem: item
        });
    };

    hideEditPanel = () => {
        this.setState({
            isEditPanelOpen: false
        });
    };

    get miniCartInner() {
        const {
            checkout,
            productList,
            props,
        } = this;
        const { classes, isCartEmpty } = props;

        if (isCartEmpty) {
            return <EmptyMiniCart />;
        }

        return (
            <Fragment>
                <div className={classes.body}>{productList}</div>
                <div className={classes.footer}>{checkout}</div>
            </Fragment>
        );
    }

    render() {
        if (this.props.loading) {
            return <div>Fetching Data</div>;
        }

        const { miniCartInner, productOptions, props, state } = this;
        const { classes, isOpen } = props;
        const { isEditPanelOpen } = state;
        const className = isOpen ? classes.root_open : classes.root;

        const body = isEditPanelOpen ? productOptions : miniCartInner;
        const title = isEditPanelOpen
            ? 'Edit Cart Item'
            : 'Shopping Cart';

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>{title}</span>
                    </h2>
                    <Trigger>
                        <Icon name="x" />
                    </Trigger>
                </div>
                {body}
            </aside>
        );
    }
}

const mapStateToProps = state => {
    const { cart } = state;

    return {
        cart,
        isCartEmpty: isEmptyCartVisible(state)
    };
};

const mapDispatchToProps = { getCartDetails, updateItemInCart, removeItemFromCart };

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MiniCart);
