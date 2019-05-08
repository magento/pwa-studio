import React, { Component, Fragment, Suspense } from 'react';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import { bool, func, object, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import {
    getCartDetails,
    updateItemInCart,
    removeItemFromCart,
    openOptionsDrawer,
    closeOptionsDrawer
} from 'src/actions/cart';
import { cancelCheckout } from 'src/actions/checkout';
import Icon from 'src/components/Icon';
import CloseIcon from 'react-feather/dist/icons/x';
import CheckoutButton from 'src/components/Checkout/checkoutButton';
import EmptyMiniCart from './emptyMiniCart';
import Mask from './mask';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';
import { isEmptyCartVisible, isMiniCartMaskOpen } from 'src/selectors/cart';
import CartOptions from './cartOptions';
import getProductDetailByName from '../../queries/getProductDetailByName.graphql';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { Query } from 'react-apollo';

const Checkout = React.lazy(() => import('src/components/Checkout'));

class MiniCart extends Component {
    static propTypes = {
        cancelCheckout: func.isRequired,
        cart: shape({
            details: object,
            cartId: string,
            totals: object,
            isLoading: bool,
            isOptionsDrawerOpen: bool,
            isUpdatingItem: bool
        }),
        classes: shape({
            body: string,
            footer: string,
            footerMaskOpen: string,
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
        isCartEmpty: bool,
        updateItemInCart: func,
        openOptionsDrawer: func.isRequired,
        closeOptionsDrawer: func.isRequired,
        isMiniCartMaskOpen: bool
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
                openOptionsDrawer={this.openOptionsDrawer}
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
        const itemsQuantity = cart.details.items_qty;
        const itemQuantityText = itemsQuantity === 1 ? 'item' : 'items';
        const totalPrice = cart.totals.subtotal;

        return hasSubtotal ? (
            <dl className={classes.totals}>
                <dt className={classes.subtotalLabel}>
                    <span>
                        Cart Total :&nbsp;
                        <Price
                            currencyCode={cartCurrencyCode}
                            value={totalPrice}
                        />
                    </span>
                </dt>
                <dd className={classes.subtotalValue}>
                    ({itemsQuantity} {itemQuantityText})
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
        const { props, state, closeOptionsDrawer } = this;
        const { updateItemInCart, cart } = props;
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
                    if (loading) return loadingIndicator;

                    const itemWithOptions = data.products.items[0];

                    return (
                        <CartOptions
                            cartItem={focusItem}
                            configItem={itemWithOptions}
                            closeOptionsDrawer={closeOptionsDrawer}
                            isUpdatingItem={cart.isUpdatingItem}
                            updateCart={updateItemInCart}
                        />
                    );
                }}
            </Query>
        ) : (
            <CartOptions
                cartItem={focusItem}
                configItem={{}}
                closeOptionsDrawer={closeOptionsDrawer}
                isUpdatingItem={cart.isUpdatingItem}
                updateCart={updateItemInCart}
            />
        );
    }

    openOptionsDrawer = item => {
        this.setState({
            focusItem: item
        });
        this.props.openOptionsDrawer();
    };

    closeOptionsDrawer = () => {
        this.props.closeOptionsDrawer();
    };

    get miniCartInner() {
        const { checkout, productList, props } = this;
        const { classes, isCartEmpty, isMiniCartMaskOpen } = props;

        if (isCartEmpty) {
            return <EmptyMiniCart />;
        }

        const footer = checkout;

        const footerClassName = isMiniCartMaskOpen
            ? classes.footerMaskOpen
            : classes.footer;

        return (
            <Fragment>
                <div className={classes.body}>{productList}</div>
                <div className={footerClassName}>{footer}</div>
            </Fragment>
        );
    }

    render() {
        const { miniCartInner, productOptions, props } = this;
        const {
            cancelCheckout,
            cart: { isOptionsDrawerOpen, isLoading },
            classes,
            isMiniCartMaskOpen,
            isOpen
        } = props;

        const className = isOpen ? classes.root_open : classes.root;
        const body = isOptionsDrawerOpen ? productOptions : miniCartInner;
        const title = isOptionsDrawerOpen ? 'Edit Cart Item' : 'Shopping Cart';

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
                {isLoading ? loadingIndicator : body}
                <Mask isActive={isMiniCartMaskOpen} dismiss={cancelCheckout} />
            </aside>
        );
    }
}

const mapStateToProps = state => {
    const { cart } = state;

    return {
        cart,
        isCartEmpty: isEmptyCartVisible(state),
        isMiniCartMaskOpen: isMiniCartMaskOpen(state)
    };
};

const mapDispatchToProps = {
    getCartDetails,
    updateItemInCart,
    removeItemFromCart,
    openOptionsDrawer,
    closeOptionsDrawer,
    cancelCheckout
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MiniCart);
