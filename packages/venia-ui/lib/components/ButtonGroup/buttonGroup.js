import React, { useMemo } from 'react';
import { arrayOf, node, shape, string } from 'prop-types';

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
     * @property {ReactNodeLike} children component to render for the
     * ButtonGroups's button component
     * @property {string} key  the unique id for a button element
     */
    items: arrayOf(
        shape({
            children: node.isRequired,
            key: string.isRequired
        })
    ).isRequired
};

ButtonGroup.defaultProps = {
    items: []
};

export default ButtonGroup;
