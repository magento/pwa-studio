import React from 'react';

import { mergeClasses } from '../../classify';
import defaultClasses from './linkTree.css';
import { NavLink } from 'react-router-dom'; // eslint-disable-line

const LinkTree = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <ul className={classes.list}> </ul>
        </div>
    );
};

export default LinkTree;
