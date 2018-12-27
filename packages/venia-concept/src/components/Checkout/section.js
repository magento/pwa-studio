import React, { Component } from 'react';
import { bool, node, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './section.css';
import Icon from 'src/components/Icon';

const editIconAttrs = {
    color: 'black',
    width: 18
};

class Section extends Component {
    static propTypes = {
        classes: shape({
            label: string,
            root: string,
            summary: string,
            icon: string
        }),
        label: node,
        selectedOption: bool,
        filledOption: bool
    };

    defaultProps = {
        filledOption: false
    };

    render() {
        const {
            children,
            classes,
            label,
            selectedOption,
            filledOption,
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
                        {selectedOption && <Icon name="check" />}{' '}
                    </span>
                </span>
                <span className={classes.editIconContainer}>
                    {filledOption ? (
                        <Icon name="edit-2" attrs={editIconAttrs} />
                    ) : null}
                </span>
            </Button>
        );
    }
}

export default classify(defaultClasses)(Section);
