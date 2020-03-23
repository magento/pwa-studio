import React from 'react';

import { mergeClasses } from '../../../classify';

import defaultClasses from './showAllButton.css';

const ShowAllButton = props => {
    const classes = mergeClasses(defaultClasses, props.classes || {});

    return (
        <button className={classes.root} onClick={props.onFooterClick}>
            Show All Items
        </button>
    );
};

export default ShowAllButton;
