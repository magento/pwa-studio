import React from 'react';

import { mergeClasses } from '../../../classify';
import EditForm, { modes as editFormModes } from './editForm';
import defaultClasses from './editing.css';

const Editing = props => {
    const {
        handleSubmit,
        isLoading,
        pageIsUpdating,
        selectedShippingMethod,
        shippingMethods
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.heading}>Shipping Method</h3>
            <EditForm
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                mode={editFormModes.INITIAL}
                pageIsUpdating={pageIsUpdating}
                selectedShippingMethod={selectedShippingMethod}
                shippingMethods={shippingMethods}
            />
        </div>
    );
};

export default Editing;
