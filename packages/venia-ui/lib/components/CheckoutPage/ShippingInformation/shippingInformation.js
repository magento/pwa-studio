import React from 'react';
import { useShippingInformation } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation';

import Button from '../../Button';
import defaultClasses from './shippingInformation.css';
import ShippingInformationOperations from './shippingInformation.gql';
import { mergeClasses } from '../../../classify';
import EditForm from './EditForm';

const ShippingInformation = props => {
    const { onSave, propClasses } = props;
    const talonProps = useShippingInformation({
        ...ShippingInformationOperations,
        onSave
    });
    const { doneEditing, loading, shippingData } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const rootClassName = doneEditing
        ? classes.root
        : classes['root--editMode'];

    if (loading) {
        return <span>Loading...</span>;
    }

    const shippingInformation = doneEditing ? (
        <div>In Read Only Mode</div>
    ) : (
        <EditForm shippingData={shippingData} />
    );
    return (
        <div className={rootClassName}>
            <h3 className={classes.editTitle}>Shipping Information</h3>
            {shippingInformation}
        </div>
    );
};

export default ShippingInformation;
