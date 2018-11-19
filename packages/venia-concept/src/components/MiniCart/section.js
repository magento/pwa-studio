import React, { Component } from 'react';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './section.css';

class Section extends Component {
    get icon() {
        const { icon } = this.props;
        const defaultAttributes = {
            color: 'rgb(var(--venia-teal))',
            width: '14px',
            height: '14px'
        };
        const iconAttributes = this.props.iconAttributes
            ? Object.assign(defaultAttributes, this.props.iconAttributes)
            : defaultAttributes;
        return icon ? <Icon name={icon} attrs={iconAttributes} /> : null;
    }

    render() {
        const { icon } = this;
        const { classes, onClick, text } = this.props;

        return (
            <li className={classes.menuItem}>
                <button onClick={onClick}>
                    {icon}
                    <span className={classes.text}>{text}</span>
                </button>
            </li>
        );
    }
}

export default classify(defaultClasses)(Section);
