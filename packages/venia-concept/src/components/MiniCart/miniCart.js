import React, { Component, Fragment, Suspense } from 'react';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import { bool, func, object, shape, string } from 'prop-types';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { getCartDetails, removeItemFromCart } from 'src/actions/cart';
import { cancelCheckout } from 'src/actions/checkout';
import Icon from 'src/components/Icon';
import CloseIcon from 'react-feather/dist/icons/x';
import Button from 'src/components/Button';
import CheckoutButton from 'src/components/Checkout/checkoutButton';
import EmptyMiniCart from './emptyMiniCart';
import Mask from './mask';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';
import { isEmptyCartVisible, isMiniCartMaskOpen } from 'src/selectors/cart';

const Checkout = React.lazy(() => import('src/components/Checkout'));

class MiniCart extends Component {
    static propTypes = {
        cancelCheckout: func.isRequired,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
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
        isMiniCartMaskOpen: bool
    };

    constructor(...args) {
        super(...args);
        this.state = {
            isEditPanelOpen: false,
            focusItem: null,
            isLoading: false
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
                loadingElement={this.loadingElement}
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
                <Button priority="high">Update Cart</Button>
            </div>
        );
    }

    get loading() {
        const {
            isLoading
        } = this.state;

        return isLoading ? loadingIndicator : null;
    }

    loadingElement = bool => {
        this.setState({
            isLoading: bool
        });
    };

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
            state,
            loading
        } = this;

        const { classes, isCartEmpty, isMiniCartMaskOpen } = props;
        const { isEditPanelOpen } = state;

        if (isCartEmpty) {
            return <EmptyMiniCart />;
        }

        const body = isEditPanelOpen ? productOptions : productList;
        const footer = isEditPanelOpen ? productConfirm : checkout;
        const footerClassName = isMiniCartMaskOpen
            ? classes.footerMaskOpen
            : classes.footer;

        return (
            <Fragment>
                <div className={classes.body}>
                    {loading}
                    {body}
                </div>
                <div className={footerClassName}>{footer}</div>
            </Fragment>
        );
    }

    render() {
        const { miniCartInner, props, state } = this;

        const { classes, isOpen, isMiniCartMaskOpen, cancelCheckout } = props;

        const { isEditPanelOpen } = state;

        const className = isOpen ? classes.root_open : classes.root;

        const title = isEditPanelOpen ? 'Edit Cart Item' : 'Shopping Cart';

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
                {miniCartInner}
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
    removeItemFromCart,
    cancelCheckout
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MiniCart);
