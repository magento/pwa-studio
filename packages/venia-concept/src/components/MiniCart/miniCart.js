import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { shape, string, bool } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import { getCartDetails, removeItemFromCart } from 'src/actions/cart';
import Icon from 'src/components/Icon';
import Button from 'src/components/Button';
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

        const CheckoutModule = await import('src/components/Checkout');
        Checkout = CheckoutModule.default;
    }

    get productList() {
        const {
            cartId,
            cartCurrencyCode,
            cart,
            removeItemFromCart
        } = this.props;
        return cartId ? (
            <ProductList
                removeItemFromCart={removeItemFromCart}
                showEditPanel={this.showEditPanel}
                currencyCode={cartCurrencyCode}
                items={cart.details.items}
            />
        ) : null;
    }

    get totalsSummary() {
        const { cartId, cartCurrencyCode, cart, classes } = this.props;
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

    get checkout() {
        const { props, totalsSummary } = this;
        const { classes, cart } = props;

        return (
            <div>
                <div className={classes.summary}>{totalsSummary}</div>
                <Checkout cart={cart} />
            </div>
        );
    }

    get productOptions() {
        const { classes } = this.props;

        const itemName = this.state.focusItem
            ? this.state.focusItem.name
            : null;
        const itemPrice = this.state.focusItem
            ? this.state.focusItem.price
            : null;

        return (
            <div className={classes.content}>
                <div className={classes.focusItem}>
                    {itemName}
                    <div className={classes.price}>${itemPrice}</div>
                </div>
                <div className={classes.options}>Choose a Size:</div>
            </div>
        );
    }

    get productConfirm() {
        const { classes } = this.props;

        return (
            <div className={classes.save}>
                <Button onClick={this.hideEditPanel}>Cancel</Button>
                <Button>Update Cart</Button>
            </div>
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
            productConfirm,
            productList,
            productOptions,
            props,
            state
        } = this;
        const { classes, isCartEmpty } = props;

        if (isCartEmpty) {
            return <EmptyMiniCart />;
        }

        const { isEditPanelOpen } = state;
        const body = isEditPanelOpen ? productOptions : productList;
        const footer = isEditPanelOpen ? productConfirm : checkout;

        return (
            <Fragment>
                <div className={classes.body}>{body}</div>
                <div className={classes.footer}>{footer}</div>
            </Fragment>
        );
    }

    render() {
        if (this.props.loading) {
            return <div>Fetching Data</div>;
        }

        const { miniCartInner, props } = this;
        const { classes, isOpen } = props;
        const className = isOpen ? classes.root_open : classes.root;
        const title = this.state.isEditPanelOpen
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

const mapDispatchToProps = { getCartDetails, removeItemFromCart };

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MiniCart);
