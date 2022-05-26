import React from 'react';
import { oneOf } from 'prop-types';

import Button from '../Button';

/**
 * A component for link buttons.
 *
 * @typedef LinkButton
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single link button.
 */
const LinkButton = props => {
    const { children, type, ...restProps } = props;

    return (
        <Button design={'tertiary'} size={'small'} type={type} {...restProps}>
            {children}
        </Button>
    );
};

/**
 * Props for {@link Button}
 *
 * @typedef props
 *
 * @property {string} type the type of the Button
 */
LinkButton.propTypes = {
    type: oneOf(['button', 'reset', 'submit']).isRequired
};

LinkButton.defaultProps = {
    type: 'button'
};

export default LinkButton;
