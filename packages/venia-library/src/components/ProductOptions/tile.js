import React, { Component } from 'react';
import { bool, number, shape, string } from 'prop-types';

import classify from 'src/classify';
import Tooltip from './toolTip';
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
        itemIndex: number
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
            // eslint-disable-next-line
            itemIndex,
            ...restProps
        } = this.props;
        const className = classes[getClassName('root', isSelected, hasFocus)];
        const { label } = item;

        return (
            <Tooltip text={label}>
                <button {...restProps} className={className}>
                    <span>{label}</span>
                </button>
            </Tooltip>
        );
    }
}

export default classify(defaultClasses)(Tile);
