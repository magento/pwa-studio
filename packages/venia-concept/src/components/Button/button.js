import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './button.css';

class Button extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            content: PropTypes.string,
            root: PropTypes.string,
            rootFilled: PropTypes.string
        }),
        type: PropTypes.oneOf(['button', 'reset', 'submit']),
        filled: PropTypes.bool
    };

    static defaultProps = {
        type: 'button',
        filled: false
    };

    render() {
        const { children, classes, type, filled, ...restProps } = this.props;
        const className = filled ? classes.rootFilled : classes.root;

        return (
            <button className={className} type={type} {...restProps}>
                <span className={classes.content}>{children}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Button);
