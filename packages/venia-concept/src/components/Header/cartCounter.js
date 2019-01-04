import React, { Component } from 'react';
import classify from 'src/classify';

import defaultClasses from './cartCounter.css';

class CartCounter extends Component {
    
    // get showCounter() {
    //     const { counter, classes } = this.props;
    //     return counter > 0 ? (
    //         <span className={classes.counter}>{counter}</span>
    //     ) : null;
    // }

    render() {
        const { counter, classes } = this.props;
        return counter > 0 ? (
            <span className={classes.counter}>{counter}</span>
        ) : null;
    }
};

export default classify(defaultClasses)(CartCounter);
