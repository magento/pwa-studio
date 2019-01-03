import React, { Component } from 'react';
import { bool, number, oneOfType, shape, string } from 'prop-types';

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
            id: oneOfType([number, string]),
            label: string
        }),
        itemIndex: number
    };

    render() {
        const {
            classes,
            hasFocus,
            isSelected,
            item,
            // eslint-disable-next-line
            itemIndex,
            ...restProps
        } = this.props;
        const className = classes[getClassName('root', isSelected, hasFocus)];
        const { label } = item;

        return (
            <button {...restProps} className={className}>
                <span>{label}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Tile);
