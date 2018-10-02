import React, { Component } from 'react';
import { node, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './section.css';

class Section extends Component {
    static propTypes = {
        classes: shape({
            label: string,
            root: string,
            summary: string
        }),
        label: node
    };

    render() {
        const { children, classes, label, ...restProps } = this.props;

        return (
            <Button classes={classes} {...restProps}>
                <span className={classes.label}>
                    <span>{label}</span>
                </span>
                <span className={classes.summary}>{children}</span>
            </Button>
        );
    }
}

export default classify(defaultClasses)(Section);
