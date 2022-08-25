import React from 'react';
import defaultClasses from './columnGroup.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

/**
 * Page Builder ColumnGroup component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef ColumnGroup
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that wraps {@link Column} components.
 */
const ColumnGroup = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { display, children } = props;
    const dynamicStyles = {
        display
    };

    return (
        <div style={dynamicStyles} className={classes.root}>
            {children}
        </div>
    );
};

/**
 * Props for {@link ColumnGroup}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the ColumnGroup
 * @property {String} classes.root CSS classes for the root container element
 * @property {String} display CSS display property
 */
ColumnGroup.propTypes = {
    classes: shape({
        root: string
    }),
    display: string
};

export default ColumnGroup;
