import { Component, createElement } from 'react';
import { bool, func } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './shippingAddress.css';

class ShippingAddress extends Component {
    static propTypes = {
        busy: bool.isRequired,
        updateOrder: func.isRequired
    };

    render() {
        const { busy, classes, updateOrder } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.body}>Shipping Address</div>
                <div className={classes.footer}>
                    <Button disabled={busy} onClick={updateOrder}>
                        <span>Save</span>
                    </Button>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(ShippingAddress);
