import { Component, createElement } from 'react';
import { shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import ProductList from './productList';
import Trigger from './trigger';
import mockData from './mockData';
import defaultClasses from './miniCart.css';

class MiniCart extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            checkout: string,
            cta: string,
            footer: string,
            header: string,
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

    render() {
        const { classes, data, isOpen } = this.props;
        const className = isOpen ? classes.root_open : classes.root;
        const iconDimensions = { height: 16, width: 16 };

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
                    <div className={classes.cta}>
                        <Button>
                            <Icon name="lock" attrs={iconDimensions} />
                            <span>Checkout</span>
                        </Button>
                    </div>
                </div>
            </aside>
        );
    }
}

export default classify(defaultClasses)(MiniCart);
