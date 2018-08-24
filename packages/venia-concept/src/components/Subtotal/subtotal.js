import { Component, createElement } from 'react';
import { string, number } from 'prop-types';
import classify from 'src/classify'
import defaultClasses from './subtotal.css'
import { Price } from '@magento/peregrine';

class Subtotal extends Component {
    static propTypes = {
        items_qty: number,
        currencyCode: string,
        subtotal: number
    };

    render() {
        const {
            items_qty,
            currencyCode,
            subtotal
        } = this.props;

        const classes = defaultClasses;

        return (
            <dl className={classes.totals}>
                <dt className={classes.subtotalLabel}>
                    <span>
                        Subtotal
                        {` (${items_qty} Items)`}
                    </span>
                </dt>
                <dd className={classes.subtotalValue}>
                    <Price
                        currencyCode={currencyCode}
                        value={subtotal}
                    />
                </dd>
            </dl>
        );
    }

}

export default classify(defaultClasses)(Subtotal);
