import React from 'react';
import { useIntl } from 'react-intl';
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
        addLabel,
        action,
        children,
        classes: propClasses,
        ...restProps
    } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const { formatMessage } = useIntl();
    const arialabelClear = formatMessage({
        id: 'global.clearText',
        defaultMessage: 'Clear Text'
    });

    const arialabelClose = formatMessage({
        id: 'global.close',
        defaultMessage: 'Close'
    });

    let resultedLabel = addLabel ? arialabelClear : arialabelClose;

    const handleKeypress = () => {
        action();
        resultedLabel = '';
    };

    const changeAction = e => {
        if (e.keyCode === 13) {
            action();
        }
    };

    return (
        <button
            className={classes.root}
            type="button"
            onClick={handleKeypress}
            onKeyDown={changeAction}
            aria-hidden="false"
            aria-label={resultedLabel}
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
