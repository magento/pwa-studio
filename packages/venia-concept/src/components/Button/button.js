import React, { Component } from 'react';
import { oneOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './button.css';

class Button extends Component {
    static propTypes = {
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
        const { children, classes, type, ...restProps } = this.props;

        return (
            <button className={classes.root} type={type} {...restProps}>
                <span className={classes.content}>{children}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Button);
