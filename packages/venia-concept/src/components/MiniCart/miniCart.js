import { Component, createElement } from 'react';
import { shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import { store } from 'src';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import ProductList from './productList';
import Trigger from './trigger';
import mockData from './mockData';
import defaultClasses from './miniCart.css';

let Checkout;

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

    static defaultProps = {
        // TODO: remove when connected to graphql
        data: mockData
    };

    async componentDidMount() {
        const {
            default: CheckoutComponent
        } = await import('src/components/Checkout');
        const {
            default: checkoutReducer
        } = await import('src/store/reducers/checkout');

        Checkout = CheckoutComponent;
        store.addReducer('checkout', checkoutReducer);
    }

    get checkout() {
        return Checkout ? <Checkout /> : null;
    }

    render() {
        const { checkout, props } = this;
        const { classes, data, isOpen } = props;
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
                <div className={classes.body}>
                    <ProductList items={data} />
                </div>
                <div className={classes.footer}>
                    <div className={classes.summary}>
                        <dl className={classes.totals}>
                            <dt className={classes.subtotalLabel}>
                                <span>Subtotal (4 Items)</span>
                            </dt>
                            <dd className={classes.subtotalValue}>
                                <Price currencyCode="USD" value={528} />
                            </dd>
                        </dl>
                    </div>
                </div>
                {checkout}
            </aside>
        );
    }
}

export default classify(defaultClasses)(MiniCart);
