import React, { Component } from 'react';
import { oneOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './button.css';

const getRootClassName = (contrast, priority) =>
    `root_priority-${priority}_contrast-${contrast}`;

export class Button extends Component {
    static propTypes = {
        classes: shape({
            content: string,
            root: string,
            'root_priority-normal_contrast_normal': string,
            'root_priority-high_contrast_normal': string,
            'root_priority-normal_contrast_high': string,
            'root_priority-high_contrast_high': string
        }).isRequired,
        contrast: oneOf(['high', 'normal']).isRequired,
        priority: oneOf(['high', 'normal']).isRequired,
        type: oneOf(['button', 'reset', 'submit']).isRequired
    };

    static defaultProps = {
        contrast: 'normal',
        priority: 'normal',
        type: 'button'
    };

    render() {
        const {
            children,
            classes,
            contrast,
            priority,
            type,
            ...restProps
        } = this.props;

        const rootClassName = classes[getRootClassName(contrast, priority)];

        return (
            <button className={rootClassName} type={type} {...restProps}>
                <span className={classes.content}>{children}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Button);
