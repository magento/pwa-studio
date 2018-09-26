import { Component, createElement } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import { addReducer } from 'src/store';
import { getCartDetails } from 'src/actions/cart';
import Icon from 'src/components/Icon';
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
