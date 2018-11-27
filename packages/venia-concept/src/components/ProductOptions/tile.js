import React, { Component } from 'react';
import { bool, number, oneOfType, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

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
        })
    };

    render() {
        const {
            classes,
            hasFocus, // eslint-disable-line
            isSelected,
            item,
            ...restProps
        } = this.props;
        const className = isSelected ? classes.root_selected : classes.root;
        const { label } = item;

        return (
            <button {...restProps} className={className}>
                <span>{label}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Tile);
