import { Component, createElement } from 'react';
import { shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import Product from './product';
import Trigger from './trigger';
import mockData from './mockData';
import defaultClasses from './miniCart.css';

class MiniCart extends Component {
    static propTypes = {
        classes: shape({
            checkout: string,
            cta: string,
            header: string,
            products: string,
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
        const productListClasses = { root: classes.products };

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
                <List
                    render="ul"
                    renderItem={Product}
                    items={data}
                    classes={productListClasses}
                />
                <div className={classes.summary}>
                    <dl className={classes.totals}>
                        <dt className={classes.subtotalLabel}>
                            Subtotal (4 Items)
                        </dt>
                        <dd className={classes.subtotalValue}>$528.00</dd>
                    </dl>
                </div>
                <div className={classes.cta}>
                    <Button>
                        <Icon name="lock" attrs={iconDimensions} />
                        <span>Checkout</span>
                    </Button>
                </div>
            </aside>
        );
    }
}

export default classify(defaultClasses)(MiniCart);
