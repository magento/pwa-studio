import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './cart.css';

class Cart extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        ready: bool.isRequired,
        submitCart: func.isRequired,
        submitting: bool.isRequired
    };

    render() {
        const { classes, ready, submitCart, submitting } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.footer}>
                    <CheckoutButton
                        ready={ready}
                        submitting={submitting}
                        submitCart={submitCart}
                    />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Cart);
