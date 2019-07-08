import React from 'react';
import { func, node, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import defaultClasses from './trigger.css';

const Trigger = props => {
    const { action, children } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <button className={classes.root} type="button" onClick={action}>
            {children}
        </button>
    );
};

Trigger.propTypes = {
    action: func.isRequired,
    children: node,
    classes: shape({
        root: string
    })
};

export default Trigger;
