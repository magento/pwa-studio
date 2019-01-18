import React, { Component } from 'react';
import { shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './button.css';

class Button extends Component {
    static propTypes = {
        classes: shape({
            content: string,
            root: string
        }).isRequired
    };

    render() {
        const { children, classes, ...rest } = this.props;

        return (
            <button {...rest} className={classes.root}>
                <span className={classes.content}>{children}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Button);
