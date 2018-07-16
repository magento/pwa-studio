import { Component, createElement } from 'react';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import ShippingAddress from './shippingAddress';
import Summary from './summary';
import defaultClasses from './form.css';

class Form extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        enterSubflow: func.isRequired,
        status: string.isRequired,
        subflow: string,
        submitOrder: func.isRequired,
        updateOrder: func.isRequired
    };

    render() {
        const {
            classes,
            enterSubflow,
            status,
            subflow,
            submitOrder,
            updateOrder
        } = this.props;
        let child;

        console.log({ subflow });

        switch (subflow) {
            case 'SHIPPING_ADDRESS': {
                child = <ShippingAddress updateOrder={updateOrder} />;
                break;
            }
            default: {
                child = (
                    <Summary
                        status={status}
                        enterSubflow={enterSubflow}
                        submitOrder={submitOrder}
                    />
                );
            }
        }

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Form);
