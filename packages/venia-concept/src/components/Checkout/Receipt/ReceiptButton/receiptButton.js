import React, { Component } from 'react';
import { shape, string, func, oneOf } from 'prop-types';
import classify from 'src/classify';
import Button from 'src/components/Button';

import defaultClasses from './receiptButton.css';

class ReceiptButton extends Component {
    static propTypes = {
        onClick: func,
        classes: shape({
            content: string,
            root: string
        }),
        type: oneOf(['button', 'reset', 'submit'])
    };

    static defaultProps = {
        type: 'button'
    };

    render() {
        const { classes, children, onClick, type } = this.props;

        return (
            <Button classes={classes} onClick={onClick} type={type}>
                {children}
            </Button>
        );
    }
}

export default classify(defaultClasses)(ReceiptButton);
