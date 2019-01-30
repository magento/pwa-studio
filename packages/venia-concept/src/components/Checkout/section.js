import React, { Component } from 'react';
import { bool, node, shape, string } from 'prop-types';
import CheckIcon from 'react-feather/dist/icons/check';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './section.css';

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

        const icon = selectedOption ? <Icon src={CheckIcon} size={16} /> : null;

        return (
            <button className={classes.root} {...restProps}>
                <span className={classes.content}>
                    <span className={classes.label}>
                        <span>{label}</span>
                    </span>
                    <span className={classes.summary}>{children}</span>
                    <span className={classes.icon}>{icon}</span>
                </span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Section);
