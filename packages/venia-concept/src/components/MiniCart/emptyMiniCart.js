import React, { Component } from 'react';
import { string, shape } from 'prop-types';

import classify from 'src/classify';
import Trigger from './trigger';
import defaultClasses from './emptyMiniCart.css';

class EmptyMiniCart extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <h3 className={classes.emptyTitle}>
                    There are no items in your shopping cart
                </h3>
                <Trigger>
                    <span className={classes.continue}>Continue Shopping</span>
                </Trigger>
            </div>
        );
    }
}

export default classify(defaultClasses)(EmptyMiniCart);
