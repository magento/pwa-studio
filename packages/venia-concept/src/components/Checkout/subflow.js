import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import BillingAddress from './billingAddress';
import ShippingAddress from './shippingAddress';
import ShippingMethod from './shippingMethod';
import Summary from './summary';
import defaultClasses from './subflow.css';

const stepEnum = [
    'BILLING_ADDRESS',
    'SHIPPING_ADDRESS',
    'SHIPPING_METHOD',
    'SUMMARY'
];

class Subflow extends Component {
    static propTypes = {
        busy: bool.isRequired,
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        enterSubflow: func.isRequired,
        subflow: shape({
            busy: bool.isRequired,
            step: string.isRequired
        }).isRequired,
        submitOrder: func.isRequired,
        updateOrder: func.isRequired
    };

    render() {
        const {
            busy,
            classes,
            enterSubflow,
            subflow,
            submitOrder,
            updateOrder
        } = this.props;

        const subflowProps = { busy, updateOrder };
        let child;

        switch (subflow.step) {
            case 'SUMMARY': {
                child = (
                    <Summary
                        busy={busy}
                        enterSubflow={enterSubflow}
                        submitOrder={submitOrder}
                    />
                );
                break;
            }
            case 'SHIPPING_ADDRESS': {
                child = <ShippingAddress {...subflowProps} />;
                break;
            }
            case 'BILLING_ADDRESS': {
                child = <BillingAddress {...subflowProps} />;
                break;
            }
            case 'SHIPPING_METHOD': {
                child = <ShippingMethod {...subflowProps} />;
                break;
            }
            default: {
                const message =
                    'Checkout is in an invalid state. ' +
                    'Expected `subflow.step` to be one of the following: ' +
                    stepEnum.map(s => `\`${s}\``).join(', ') +
                    `. Instead, received the following: \`${subflow.step}\``;

                throw new Error(message);
            }
        }

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Subflow);
