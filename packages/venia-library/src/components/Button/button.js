import React, { Component } from 'react';
import { oneOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './button.css';

const getRootClassName = priority => `root_${priority}Priority`;

export class Button extends Component {
    static propTypes = {
        classes: shape({
            content: string,
            root: string,
            root_highPriority: string,
            root_normalPriority: string
        }).isRequired,
        priority: oneOf(['high', 'normal']).isRequired,
        type: oneOf(['button', 'reset', 'submit']).isRequired
    };

    static defaultProps = {
        priority: 'normal',
        type: 'button'
    };

    render() {
        const { children, classes, priority, type, ...restProps } = this.props;

        const rootClassName = classes[getRootClassName(priority)];

        return (
            <button className={rootClassName} type={type} {...restProps}>
                <span className={classes.content}>{children}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Button);
