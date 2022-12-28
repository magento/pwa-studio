import React, { useRef } from 'react';
import { node, string } from 'prop-types';
import { useButton } from 'react-aria';

/**
 * A component for buttons using [React Aria useButton()]{@link https://react-spectrum.adobe.com/react-aria/useButton.html}.
 *
 * @typedef AriaButton
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a button with improved accessibility.
 */
const AriaButton = props => {
    const ref = useRef();
    const { buttonProps } = useButton(props, ref);
    const { children } = props;

    return (
        <button {...buttonProps} className={props.className} ref={ref}>
            {children}
        </button>
    );
};

/**
 * Props for {@link AriaButton}
 *
 * @typedef props
 *
 * @property {string} className class name of the button
 * @property {ReactNodeLike} children children of the button
 */
AriaButton.propTypes = {
    className: string,
    children: node
};

export default AriaButton;
