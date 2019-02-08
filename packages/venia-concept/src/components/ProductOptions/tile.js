import React, { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

class Tile extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        hasFocus: bool,
        isSelected: bool,
        item: shape({
            label: string.isRequired
        }).isRequired,
        onBlur: func,
        onClick: func,
        onFocus: func
    };

    static defaultProps = {
        hasFocus: false,
        isSelected: false
    };

    render() {
        const {
            classes,
            hasFocus,
            isSelected,
            item,
            onBlur,
            onClick,
            onFocus
        } = this.props;
        const className = classes[getClassName('root', isSelected, hasFocus)];
        const { label } = item;

        return (
            <button
                className={className}
                onBlur={onBlur}
                onClick={onClick}
                onFocus={onFocus}
            >
                <span>{label}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Tile);
