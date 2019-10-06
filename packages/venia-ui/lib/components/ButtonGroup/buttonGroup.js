import React, { useMemo } from 'react';
import { arrayOf, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Button from './button';
import defaultClasses from './buttonGroup.css';

/**
 * A container for creating a series of buttons.
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
    const classes = mergeClasses(defaultClasses, props.classes);

    const children = useMemo(
        () =>
            Array.from(items, ({ key, ...itemProps }) => (
                <Button key={key} {...itemProps} />
            )),
        [items]
    );

    return <div className={classes.root}>{children}</div>;
};

ButtonGroup.propTypes = {
    classes: shape({
        root: string
    }),
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
