import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import ResetButton from './resetButton';
import defaultClasses from './receipt.css';

class Exit extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        resetCheckout: func.isRequired
    };

    render() {
        const { classes, resetCheckout } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.body}>Thank you for your order!</div>
                <div className={classes.footer}>
                    <ResetButton resetCheckout={resetCheckout} />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Exit);
