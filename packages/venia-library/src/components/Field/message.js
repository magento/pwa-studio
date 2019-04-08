import React, { Component } from 'react';
import { node, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './message.css';

export class Message extends Component {
    static propTypes = {
        children: node,
        classes: shape({
            root: string,
            root_error: string
        }),
        fieldState: shape({
            asyncError: string,
            error: string
        })
    };

    render() {
        const { children, classes, fieldState } = this.props;
        const { asyncError, error } = fieldState;
        const errorMessage = error || asyncError;
        const className = errorMessage ? classes.root_error : classes.root;

        return <p className={className}>{errorMessage || children}</p>;
    }
}

export default classify(defaultClasses)(Message);
