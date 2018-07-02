import { Component, createElement } from 'react';
import { func, shape, string } from 'prop-types';

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

class Flow extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        resetCheckout: func,
        requestOrder: func,
        status: string,
        submitOrder: func
    };

    render() {
        const {
            classes,
            resetCheckout,
            requestOrder,
            status,
            submitOrder
        } = this.props;
        const step = stepMap[status];
        console.log(status, step);
        let child = null;

        switch (step) {
            case 'STEP_1': {
                child = (
                    <Entrance status={status} requestOrder={requestOrder} />
                );
                break;
            }
            case 'STEP_2': {
                child = <Form status={status} submitOrder={submitOrder} />;
                break;
            }
            case 'STEP_3': {
                child = <Exit resetCheckout={resetCheckout} />;
                break;
            }
        }

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Flow);
