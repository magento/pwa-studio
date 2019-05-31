import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Mask from 'src/components/Mask';

import defaultClasses from './mask.css';

const MiniCartMask = props => {
    const { dismiss, isActive } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

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
