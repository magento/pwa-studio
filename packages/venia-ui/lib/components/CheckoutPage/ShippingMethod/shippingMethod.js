import React, { useMemo } from 'react';

import { displayStates, useShippingMethod } from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '../../../classify';

import Done from './done';
import Editing from './editing';
import Queued from './queued';
import defaultClasses from './shippingMethod.css';

const ShippingMethod = props => {
    const { doneEditing, onSave, showContent } = props;

    const talonProps = useShippingMethod({
        doneEditing,
        showContent
    });

    const { displayState } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const contentsMap = useMemo(() => new Map()
        .set(displayStates.QUEUED, <Queued />)
        .set(displayStates.EDITING, <Editing onSave={onSave} />)
        .set(displayStates.DONE, <Done />)
    , [onSave]);
    const contents = contentsMap.get(displayState);

    return (
        <div className={classes.root}>
            { contents }
        </div>
    );
};

export default ShippingMethod;
