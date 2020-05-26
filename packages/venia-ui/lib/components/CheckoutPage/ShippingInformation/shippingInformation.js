import React, { Fragment } from 'react';
import { func, string, shape } from 'prop-types';
import { Edit2 as EditIcon } from 'react-feather';
import { useShippingInformation } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import LoadingIndicator from '../../LoadingIndicator';
import AddressForm from './AddressForm';
import Card from './card';
import EditModal from './editModal';
import defaultClasses from './shippingInformation.css';
import ShippingInformationOperations from './shippingInformation.gql';

const ShippingInformation = props => {
    const { classes: propClasses, onSave, toggleActiveContent } = props;
    const talonProps = useShippingInformation({
        onSave,
        toggleActiveContent,
        ...ShippingInformationOperations
    });
    const {
        doneEditing,
        handleEditShipping,
        hasUpdate,
        isSignedIn,
        isLoading,
        shippingData
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const rootClassName = !doneEditing
        ? classes.root_editMode
        : hasUpdate
        ? classes.root_updated
        : classes.root;

    if (isLoading) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                Fetching Shipping Information...
            </LoadingIndicator>
        );
    }

    const editModal = !isSignedIn ? (
        <EditModal shippingData={shippingData} />
    ) : null;

    const shippingInformation = doneEditing ? (
        <Fragment>
            <div className={classes.cardHeader}>
                <h5 className={classes.cardTitle}>{'Shipping Information'}</h5>
                <button onClick={handleEditShipping}>
                    <Icon
                        size={16}
                        src={EditIcon}
                        classes={{ icon: classes.editIcon }}
                    />
                    <span className={classes.editText}>{'Edit'}</span>
                </button>
            </div>
            <Card shippingData={shippingData} />
            {editModal}
        </Fragment>
    ) : (
        <Fragment>
            <h3 className={classes.editTitle}>{'1. Shipping Information'}</h3>
            <div className={classes.editWrapper}>
                <AddressForm shippingData={shippingData} />
            </div>
        </Fragment>
    );

    return <div className={rootClassName}>{shippingInformation}</div>;
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    classes: shape({
        root: string,
        root_editMode: string,
        cardHeader: string,
        cartTitle: string,
        editWrapper: string,
        editTitle: string
    }),
    onSave: func.isRequired,
    toggleActiveContent: func.isRequired
};
