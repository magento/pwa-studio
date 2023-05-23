/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { Form } from 'informed';

import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/useShippingMethod';

import { useStyle } from '../../../classify';
import Button from '../../Button';
import FormError from '../../FormError';
import LoadingIndicator from '../../LoadingIndicator';
import CompletedView from './completedView';
import ShippingRadios from './shippingRadios';
import UpdateModal from './updateModal';
import defaultClasses from './shippingMethod.module.css';

import { useLocationsCheckout } from '@magento/peregrine/lib/talons/StoreLocator/useLocationsCheckout';
import LocationsModal from '../../StoreLocator/LocationsModal';

const initializingContents = (
    <LoadingIndicator>
        <FormattedMessage id={'shippingMethod.loading'} defaultMessage={'Loading shipping methods...'} />
    </LoadingIndicator>
);

const ShippingMethod = props => {
    const { onSave, onSuccess, pageIsUpdating, setPageIsUpdating, checkoutStep } = props;

    const talonProps = useShippingMethod({
        onSave,
        onSuccess,
        setPageIsUpdating
    });

    const locationsProps = useLocationsCheckout();

    const {
        displayState,
        errors,
        handleCancelUpdate,
        handleSubmit,
        isLoading,
        isUpdateMode,
        selectedShippingMethod,
        shippingMethods,
        showUpdateMode
    } = talonProps;
    const {
        locationsData,
        handleOpenLocationModal,
        isLocationsModalOpen,
        submutLocation,
        selectedLocation,
        handleSelectLocation,
        holidayDates,
        handleChangeDay,
        local
    } = locationsProps;
    const classes = useStyle(defaultClasses, props.classes);

    let contents;
    const selectStoreBatton = useMemo(
        () =>
            selectedShippingMethod?.method_code === 'mpstorepickup' &&
            locationsData?.items.length > 0 &&
            checkoutStep < 4 ? (
                <button className={classes.selectStoreBtn} onClick={handleOpenLocationModal}>
                    <FormattedMessage id={'storeLocator.SelectStore'} defaultMessage={'Select Store'} />
                </button>
            ) : null,
        [selectedShippingMethod,locationsData]
    );
    if (displayState === displayStates.DONE) {
        const updateFormInitialValues = {
            shipping_method: selectedShippingMethod.serializedValue
        };

        contents = (
            <Fragment>
                <div className={classes.done} data-cy="ShippingMethod-done">
                    <CompletedView
                        selectedShippingMethod={selectedShippingMethod}
                        showUpdateMode={showUpdateMode}
                        selectStoreBatton={selectStoreBatton}
                        selectedLocation={selectedLocation}
                    />
                </div>
                <UpdateModal
                    formErrors={Array.from(errors.values())}
                    formInitialValues={updateFormInitialValues}
                    handleCancel={handleCancelUpdate}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    isOpen={isUpdateMode}
                    pageIsUpdating={pageIsUpdating}
                    shippingMethods={shippingMethods}
                />
                {isLocationsModalOpen && (
                    <LocationsModal
                        isOpen={isLocationsModalOpen}
                        onCancel={handleOpenLocationModal}
                        onConfirm={submutLocation}
                        locationsData={locationsData}
                        selectedLocation={selectedLocation}
                        handleSelectLocation={handleSelectLocation}
                        holidayDates={holidayDates}
                        handleChangeDay={handleChangeDay}
                        local={local}
                    />
                )}
            </Fragment>
        );
    } else {
        // We're either initializing or editing.
        let bodyContents = initializingContents;

        if (displayState === displayStates.EDITING) {
            const lowestCostShippingMethodSerializedValue = shippingMethods.length
                ? shippingMethods[0].serializedValue
                : '';
            const lowestCostShippingMethod = {
                shipping_method: lowestCostShippingMethodSerializedValue
            };

            bodyContents = (
                <Form className={classes.form} initialValues={lowestCostShippingMethod} onSubmit={handleSubmit}>
                    <ShippingRadios disabled={pageIsUpdating || isLoading} shippingMethods={shippingMethods} />
                    <div className={classes.formButtons}>
                        <Button
                            data-cy="ShippingMethod-submitButton"
                            priority="normal"
                            type="submit"
                            disabled={pageIsUpdating || isLoading}
                        >
                            <FormattedMessage
                                id={'shippingMethod.continueToNextStep'}
                                defaultMessage={'Continue to Payment Information'}
                            />
                        </Button>
                    </div>
                </Form>
            );
        }

        contents = (
            <div data-cy="ShippingMethod-root" className={classes.root}>
                <h3 data-cy="ShippingMethod-heading" className={classes.editingHeading}>
                    <FormattedMessage id={'shippingMethod.heading'} defaultMessage={'Shipping Method'} />
                </h3>
                <FormError errors={Array.from(errors.values())} />
                {bodyContents}
            </div>
        );
    }

    return <Fragment>{contents}</Fragment>;
};

ShippingMethod.propTypes = {
    classes: shape({
        done: string,
        editingHeading: string,
        form: string,
        formButtons: string,
        root: string
    }),
    onSave: func.isRequired,
    onSuccess: func.isRequired,
    pageIsUpdating: bool,
    setPageIsUpdating: func.isRequired
};

export default ShippingMethod;
