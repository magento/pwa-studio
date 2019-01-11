import React, { Component, Fragment, Suspense } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { bool, object, shape, string } from 'prop-types';

import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import {
    getCartDetails,
    updateItemInCart,
    removeItemFromCart,
    openEditPanel,
    hideEditPanel
} from 'src/actions/cart';
import Icon from 'src/components/Icon';
import CloseIcon from 'react-feather/dist/icons/x';
import CheckoutButton from 'src/components/Checkout/checkoutButton';
import EmptyMiniCart from './emptyMiniCart';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';
import { isEmptyCartVisible } from 'src/selectors/cart';
import CartOptions from './cartOptions';
import getProductDetailByName from '../../queries/getProductDetailByName.graphql';
import { Query } from 'react-apollo';

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

        if (focusItem === null) return;
        const hasOptions = focusItem.options.length !== 0;

        return hasOptions ? (
            // `Name` is being used here because GraphQL does not allow
            // filtering products by id, and sku is unreliable without
            // a reference to the base product. Additionally, `url-key`
            // cannot be used because we don't have page context in cart.
            <Query
                query={getProductDetailByName}
                variables={{ name: focusItem.name, onServer: false }}
            >
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return <div>Fetching Data</div>;

                    const itemWithOptions = data.products.items[0];

                    return (
                        <Fragment>
                            <CartOptions
                                cartItem={focusItem}
                                configItem={itemWithOptions}
                                hideEditPanel={hideEditPanel}
                                updateCart={updateItemInCart}
                            />
                        </Fragment>
                    );
                }}
            </Query>
        ) : (
            <Fragment>
                <CartOptions
                    cartItem={focusItem}
                    configItem={{}}
                    hideEditPanel={hideEditPanel}
                    updateCart={updateItemInCart}
                />
            </Fragment>
        );
    }

    showEditPanel = item => {
        this.setState({
            focusItem: item
        });
        this.props.openEditPanel();
    };

    hideEditPanel = () => {
        this.props.hideEditPanel();
    };

    get miniCartInner() {
        const { checkout, productList, props } = this;
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

        const { miniCartInner, productOptions, props } = this;
        const { classes, cart, isOpen } = props;
        const className = isOpen ? classes.root_open : classes.root;

        const body = cart.itemEditOpen ? productOptions : miniCartInner;
        const title = cart.itemEditOpen ? 'Edit Cart Item' : 'Shopping Cart';

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>{title}</span>
                    </h2>
                    <Trigger>
                        <Icon src={CloseIcon} />
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

const mapDispatchToProps = {
    getCartDetails,
    updateItemInCart,
    removeItemFromCart,
    openEditPanel,
    hideEditPanel
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MiniCart);
