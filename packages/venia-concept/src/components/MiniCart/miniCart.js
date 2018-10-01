import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import { store } from 'src';
import classify from 'src/classify';
import { addReducer } from 'src/store';
import { getCartDetails, removeItemFromCart } from 'src/actions/cart';
import Icon from 'src/components/Icon';
import Button from 'src/components/Button';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';

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
        })
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

    get editPanel() {
        const { classes } = this.props;
        const className = this.state.isEditPanelOpen
            ? classes.editPanel_open
            : classes.editPanel;
        const itemName = this.state.focusItem
            ? this.state.focusItem.name
            : null;
        const itemPrice = this.state.focusItem
            ? this.state.focusItem.price
            : null;
        return (
            <div className={className}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>Edit Cart Item</span>
                    </h2>
                    <Trigger>
                        <Icon name="x" />
                    </Trigger>
                </div>
                <div className={classes.content}>
                    <div className={classes.focusItem}>
                        {itemName} <span>${itemPrice}</span>
                    </div>
                    <div className={classes.options}>Choose a Size:</div>
                </div>
                <div className={classes.footer} />
                <div className={classes.save}>
                    <Button onClick={this.hideEditPanel}>Cancel</Button>
                    <Button>Update Cart</Button>
                </div>
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

    render() {
        if (this.props.loading) {
            return <div>Fetching Data</div>;
        }

        const { checkout, productList, totalsSummary, editPanel, props } = this;
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

const mapStateToProps = ({ cart }) => {
    const details = cart && cart.details;
    const cartId = details && details.id;
    const cartCurrencyCode =
        details && details.currency && details.currency.quote_currency_code;

    return {
        cart,
        cartId,
        cartCurrencyCode
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
