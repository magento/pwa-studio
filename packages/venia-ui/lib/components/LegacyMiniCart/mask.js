import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import Mask from '../Mask';

import defaultClasses from './mask.module.css';

const MiniCartMask = props => {
    const { dismiss, isActive } = props;

    const classes = useStyle(defaultClasses, props.classes);

    // We're rendering the shared Mask component but passing it
    // our own custom class for its active state.
    return (
        <Mask
            classes={{ root_active: classes.root_active }}
            dismiss={dismiss}
            isActive={isActive}
        />
    );
};

MiniCartMask.propTypes = {
    classes: shape({
        root_active: string
    }),
    dismiss: func,
    isActive: bool
};

export default MiniCartMask;
