import React, { useRef } from 'react';
import { useButton } from '@react-aria/button';
import { string } from 'prop-types';
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

AriaButton.propTypes = {
    className: string
};

export default AriaButton;
