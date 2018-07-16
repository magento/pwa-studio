import { Component, createElement } from 'react';
import { func } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';

const defaultClasses = {};

class ShippingAddress extends Component {
    static propTypes = {
        updateOrder: func.isRequired
    };

    render() {
        const { classes, updateOrder } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.body}>Shipping Address</div>
                <div className={classes.footer}>
                    <Button onClick={updateOrder}>
                        <span>Save</span>
                    </Button>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(ShippingAddress);
