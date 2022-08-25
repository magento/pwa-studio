import React from 'react';
import { func, node, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './trigger.module.css';

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
    const {
        action,
        children,
        ariaLabel,
        classes: propClasses,
        ...restProps
    } = props;

    const classes = useStyle(defaultClasses, propClasses);

    return (
        <button
            className={classes.root}
            type="button"
            onClick={action}
            aria-label={ariaLabel}
            {...restProps}
        >
            {children}
        </button>
    );
};

/**
 * Props for {@link Trigger}
 *
 * @typedef props
 *
 * @property {Function} action the handler for on the `onClick` event
 * handler.
 * @property {ReactNodeLike} children any elements that will be child
 * elements inside the root container.
 * @property {Object} classes An object containing the class names for the
 * Trigger component.
 * @property {string} classes.root classes for root container
 */
Trigger.propTypes = {
    action: func.isRequired,
    children: node,
    classes: shape({
        root: string
    })
};

export default Trigger;
