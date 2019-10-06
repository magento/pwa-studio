import React from 'react';
import { func, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './trigger.css';

/**
 * A component that will trigger a given action.
 *
 * @typedef Trigger
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that when triggered invokes the action.
 */
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
