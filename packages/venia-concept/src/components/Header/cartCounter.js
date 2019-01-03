import React, { Component } from 'react';

class CartCounter extends Component {
    
    get showCounter() {
        const { counter } = this.props;
        return counter > 0 ? (
            <span className="counter">{counter}</span>
        ) : null;
    }

    render() {
        return (
            {showCounter}
        )
    }
};

export default CartCounter;
