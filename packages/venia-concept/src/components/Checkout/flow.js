import { Component, createElement } from 'react';
import { func, oneOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import Entrance from './entrance';
import Exit from './exit';
import Form from './form';
import defaultClasses from './flow.css';

const stepMap = {
    READY: 'STEP_1',
    REQUESTING: 'STEP_1',
    MODIFYING: 'STEP_2',
    SUBMITTING: 'STEP_2',
    ACCEPTED: 'STEP_3'
};

const stepEnum = Object.keys(stepMap);

class Flow extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        resetCheckout: func.isRequired,
        requestOrder: func.isRequired,
        status: oneOf(stepEnum).isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const {
            classes,
            enterSubflow,
            resetCheckout,
            requestOrder,
            status,
            submitOrder
        } = this.props;

        const step = stepMap[status];
        let child = null;

        switch (step) {
            case 'STEP_1': {
                child = (
                    <Entrance status={status} requestOrder={requestOrder} />
                );
                break;
            }
            case 'STEP_2': {
                child = (
                    <Form
                        status={status}
                        enterSubflow={enterSubflow}
                        submitOrder={submitOrder}
                    />
                );
                break;
            }
            case 'STEP_3': {
                child = <Exit resetCheckout={resetCheckout} />;
                break;
            }
            default: {
                const message =
                    'Checkout is in an invalid state. ' +
                    'Expected `status` to be one of the following: ' +
                    stepEnum.map(s => `\`${s}\``).join(', ');

                throw new Error(message);
            }
        }

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Flow);
