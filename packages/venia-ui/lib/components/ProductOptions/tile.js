import React from 'react';
import { bool, func, number, oneOfType, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './tile.css';
import { useTile } from '@magento/peregrine/lib/talons/ProductOptions/useTile';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

const Tile = props => {
    const {
        hasFocus,
        isSelected,
        item: { label, value_index },
        onClick
    } = props;

    const talonProps = useTile({
        onClick,
        value_index
    });

    const { handleClick } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const className = classes[getClassName('root', isSelected, hasFocus)];

    return (
        <button onClick={handleClick} title={label} className={className}>
            <span>{label}</span>
        </button>
    );
};

export default Tile;

Tile.propTypes = {
    hasFocus: bool,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: oneOfType([number, string]).isRequired
    }).isRequired,
    onClick: func.isRequired
};

Tile.defaultProps = {
    hasFocus: false,
    isSelected: false
};
