import React, { Component } from 'react';
import { bool, node, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './label.css';

class Label extends Component {
    static propTypes = {
        children: node,
        classes: shape({
            root: string
        }),
        plain: bool
    };

    render() {
        const { children, classes, plain, ...restProps } = this.props;
        const elementType = plain ? 'span' : 'label';
        const labelProps = { ...restProps, className: classes.root };

        return React.createElement(elementType, labelProps, children);
    }
}

export default classify(defaultClasses)(Label);
