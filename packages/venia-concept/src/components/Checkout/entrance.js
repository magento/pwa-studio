import { Component, createElement } from 'react';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './entrance.css';

class Entrance extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        requestOrder: func,
        status: string
    };

    render() {
        const { classes, requestOrder, status } = this.props;

        return (
            <div className={classes.root}>
                <CheckoutButton status={status} requestOrder={requestOrder} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Entrance);
