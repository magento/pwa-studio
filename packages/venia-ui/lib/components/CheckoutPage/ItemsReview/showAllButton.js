import React, { useCallback } from 'react';

import { mergeClasses } from '../../../classify';

import defaultClasses from './showAllButton.css';

const ShowAllButton = props => {
    const { onClick } = props;
    const classes = mergeClasses(defaultClasses, props.classes || {});

    const handleClick = useCallback(() => {
        onClick();
    }, [onClick]);

    return (
        <button className={classes.root} onClick={handleClick}>
            Show All Items
        </button>
    );
};

export default ShowAllButton;
