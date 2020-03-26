import React, { Fragment } from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import { useShippingInformation } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation';

import defaultClasses from './shippingInformation.css';
import ShippingInformationOperations from './shippingInformation.gql';
import { mergeClasses } from '../../../classify';
import Card from './card';
import EditForm from './EditForm';
import Icon from '../../Icon';

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
        <Fragment>
            <div className={classes.cardHeader}>
                <h5 className={classes.cardTitle}>Shipping Information</h5>
                <button>
                    {/* Replace with CSS class once PWA-464 lands */}
                    <Icon size={16} src={EditIcon} />
                </button>
            </div>
            <Card shippingData={shippingData} />
        </Fragment>
    ) : (
        <Fragment>
            <h3 className={classes.editTitle}>1. Shipping Information</h3>
            <EditForm shippingData={shippingData} />
        </Fragment>
    );
    return <div className={rootClassName}>{shippingInformation}</div>;
};

export default ShippingInformation;
