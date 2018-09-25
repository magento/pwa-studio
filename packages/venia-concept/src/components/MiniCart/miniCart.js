import { Component, createElement } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { shape, string, func } from 'prop-types';
import { Price } from '@magento/peregrine';

import { store } from 'src';
import { getCartDetails, removeItemFromCart } from 'src/actions/cart';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import Button from 'src/components/Button';
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
        }),
        removeItemFromCart: func.isRequired
    };

    constructor(...args) {
        super(...args);
        this.state = {
            isEditPanelOpen: false,
            focusItem: null
        }
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
        const { cartId, cartCurrencyCode, cart, removeItemFromCart } = this.props;
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
        const className = this.state.isEditPanelOpen ? classes.editPanel_open : classes.editPanel;
        const itemName = this.state.focusItem ? this.state.focusItem.name : null;
        const itemPrice = this.state.focusItem ? this.state.focusItem.price : null;
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
                    <div className={classes.focusItem}>{itemName} <span>${itemPrice}</span></div>
                    <div className={classes.options}>Choose a Size:</div>
                </div>
                <div className={classes.footer}></div>
                <div className={classes.save}>
                    <Button onClick={this.hideEditPanel}>Cancel</Button>
                    <Button>Update Cart</Button>
                </div>
            </div>
        );
    }

    showEditPanel = (item) => {
        this.setState({
            isEditPanelOpen: true,
            focusItem: item
        });
    }

    hideEditPanel = () => {
        this.setState({
            isEditPanelOpen: false
        })
    }

    render() {
        if (this.props.loading) {
            return <div>Fetching Data</div>;
        }

        const { checkout, productList, totalsSummary, editPanel, props } = this;
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
                {editPanel}
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
        { getCartDetails, removeItemFromCart }
    )
)(MiniCart);
