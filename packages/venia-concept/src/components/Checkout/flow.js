import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Entrance from './entrance';
import Exit from './exit';
import Subflow from './subflow';
import defaultClasses from './flow.css';

const stepEnum = ['CART', 'CHECKOUT', 'CONFIRMATION'];

class Flow extends Component {
    static propTypes = {
        busy: bool.isRequired,
        classes: shape({
            root: string
        }),
        resetCheckout: func.isRequired,
        requestOrder: func.isRequired,
        step: string.isRequired,
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
            resetCheckout,
            requestOrder,
            step,
            subflow,
            submitOrder,
            updateOrder
        } = this.props;

        let child = null;

        switch (step) {
            case 'CART': {
                child = <Entrance busy={busy} requestOrder={requestOrder} />;
                break;
            }
            case 'CHECKOUT': {
                child = (
                    <Subflow
                        busy={busy}
                        subflow={subflow}
                        enterSubflow={enterSubflow}
                        submitOrder={submitOrder}
                        updateOrder={updateOrder}
                    />
                );
                break;
            }
            case 'CONFIRMATION': {
                child = <Exit resetCheckout={resetCheckout} />;
                break;
            }
            default: {
                const message =
                    'Checkout is in an invalid state. ' +
                    'Expected `flow.step` to be one of the following: ' +
                    stepEnum.map(s => `\`${s}\``).join(', ');

                throw new Error(message);
            }
        }

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Flow);
