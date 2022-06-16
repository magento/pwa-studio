import React from 'react';
import { oneOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './customLinkButton.module.css';
import Button from '@magento/venia-ui/lib/components/Button';

/**
 * A component for link buttons.
 *
 * @typedef CustomLinkButton
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single link button.
 */
const CustomLinkButton = props => {
    const { children, classes: propClasses, type, ...restProps } = props;
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Button priority={'normal'} classes={{ root_normalPriority: classes.root }} type={type} {...restProps}>
            {children}
        </Button>
    );
};

/**
 * Props for {@link Button}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * Button component.
 * @property {string} classes.root classes for root container
 * @property {string} type the type of the Button
 */
CustomLinkButton.propTypes = {
    classes: shape({
        root: string
    }),
    type: oneOf(['button', 'reset', 'submit']).isRequired
};

CustomLinkButton.defaultProps = {
    type: 'button'
};

export default CustomLinkButton;
