import React, { Component } from 'react';
import { bool, node, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './section.css';
import Icon from 'src/components/Icon';

class Section extends Component {
    static propTypes = {
        classes: shape({
            label: string,
            root: string,
            summary: string,
            icon: string
        }),
        label: node,
        selectedOption: bool
    };

    render() {
        const {
            children,
            classes,
            label,
            selectedOption,
            ...restProps
        } = this.props;
        return (
            <Button classes={classes} {...restProps}>
                <span className={classes.label}>
                    <span>{label}</span>
                </span>
                <span className={classes.summary}>
                    {children}
                    <span className={classes.icon}>
                        {' '}
                        {selectedOption && <Icon name="Check" />}{' '}
                    </span>
                </span>
            </Button>
        );
    }
}

export default classify(defaultClasses)(Section);
