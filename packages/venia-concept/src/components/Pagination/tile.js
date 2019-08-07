import React, { useCallback } from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import defaultClasses from './tile.css';

const Tile = props => {
    const { isActive, number, onClick } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => onClick(number), [onClick, number]);

    const marker = isActive ? <div className={classes.marker} /> : null;

    return (
        <button className={classes.button} onClick={handleClick}>
            {marker}
            {number}
        </button>
    );
};

Tile.propTypes = {
    classes: shape({
        tileButton: string
    }),
    isActive: bool,
    number: number,
    onClick: func
};

export default Tile;
