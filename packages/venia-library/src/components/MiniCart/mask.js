import React, { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';

import Mask from 'src/components/Mask';

import classify from 'src/classify';
import defaultClasses from './mask.css';

class MiniCartMask extends Component {
    static propTypes = {
        classes: shape({
            root_active: string
        }),
        dismiss: func,
        isActive: bool
    };

    render() {
        const { classes, dismiss, isActive } = this.props;

        // We're rendering the shared Mask component but passing it
        // our own custom class for its active state.
        return (
            <Mask
                classes={{ root_active: classes.root_active }}
                dismiss={dismiss}
                isActive={isActive}
            />
        );
    }
}

export default classify(defaultClasses)(MiniCartMask);
