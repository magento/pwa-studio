import React from 'react';
import { func, node, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';

import defaultClasses from './trigger.css';

const Trigger = props => {
    const { children, onClick } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <button className={classes.root} onClick={onClick}>
            {children}
        </button>
    );
};

Trigger.propTypes = {
    children: node,
    classes: shape({
        root: string,
    }),
    onClick: func
};

export default Trigger;
