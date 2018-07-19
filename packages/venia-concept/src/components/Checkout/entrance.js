import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './entrance.css';

class Entrance extends Component {
    static propTypes = {
        busy: bool.isRequired,
        classes: shape({
            root: string
        }),
        requestOrder: func.isRequired
    };

    render() {
        const { busy, classes, requestOrder } = this.props;

        return (
            <div className={classes.root}>
                <CheckoutButton busy={busy} requestOrder={requestOrder} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Entrance);
