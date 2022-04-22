import React, { useMemo } from 'react';
import { arrayOf, bool, elementType, object, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import Button from './button';
import defaultClasses from './buttonGroup.module.css';

/**
 * A component that creates a group of buttons.
 *
 * @typedef ButtonGroup
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays multiple buttons.
 */
const ButtonGroup = props => {
    const { items } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const children = useMemo(
        () =>
            Array.from(items, ({ key, ...itemProps }) => (
                <Button key={key} {...itemProps} />
            )),
        [items]
    );

    return <div className={classes.root}>{children}</div>;
};

/**
 * Props for {@link ButtonGroup}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * ButtonGroup component.
 * @property {string} classes.root classes for root container
 * @property {buttonProps[]} items the items to evaluate
 * memoization recomputation.
 */
ButtonGroup.propTypes = {
    classes: shape({
        root: string
    }),
    /**
     * Props for a {@link ButtonGroup} button component
     *
     * @typedef buttonProps
     *
     * @property {boolean} active True if the button should be in an active state
     * @property {string} ariaLabel Value for the button's aria-label property
     * @property {object} classes Style class name overrides for the button
     * @property {string} key  the unique id for a button element
     * @property {React.ReactNode} leftIcon Component that renders the left icon
     * @property {React.ReactNode} righIcon Component that renders the right icon
     * @property {string} text Button text
     */
    items: arrayOf(
        shape({
            active: bool,
            ariaLabel: string.isRequired,
            classes: object.isRequired,
            key: string.isRequired,
            leftIcon: elementType,
            rightIcon: elementType,
            text: string
        })
    ).isRequired
};

ButtonGroup.defaultProps = {
    items: []
};

export default ButtonGroup;
