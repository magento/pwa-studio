import React, { Fragment } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Form } from 'informed';

import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import CompletedView from './completedView';
import ShippingRadios from './shippingRadios';
import UpdateModal from './updateModal';
import defaultClasses from './shippingMethod.css';

import shippingMethodOperations from './shippingMethod.gql';

const ShippingMethod = props => {
    const { onSave, pageIsUpdating, setPageIsUpdating } = props;

    const talonProps = useShippingMethod({
        onSave,
        setPageIsUpdating,
        ...shippingMethodOperations
    });

    const {
        displayState,
        handleCancelUpdate,
        handleSubmit,
        isLoading,
        isUpdateMode,
        selectedShippingMethod,
        setUpdateFormApi,
        shippingMethods,
        showUpdateMode
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    let contents;
    if (displayState === displayStates.EDITING) {
        const lowestCostShippingMethodSerializedValue = shippingMethods.length
            ? shippingMethods[0].serializedValue
            : '';
        const lowestCostShippingMethod = {
            shipping_method: lowestCostShippingMethodSerializedValue
        };
        const isContinueDisabled = pageIsUpdating || !shippingMethods.length;

        // The final JSX for the edit view.
        contents = (
            <div className={classes.root}>
                <h3 className={classes.editingHeading}>{'Shipping Method'}</h3>
                <Form
                    className={classes.form}
                    initialValues={lowestCostShippingMethod}
                    onSubmit={handleSubmit}
                >
                    <ShippingRadios
                        isLoading={isLoading}
                        shippingMethods={shippingMethods}
                    />
                    {!isLoading && (
                        <div className={classes.formButtons}>
                            <Button
                                priority="normal"
                                type="submit"
                                disabled={isContinueDisabled}
                            >
                                {'Continue to Payment Information'}
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        );
    } else {
        const updateFormInitialValues = {
            shipping_method: selectedShippingMethod.serializedValue
        };

        contents = (
            <Fragment>
                <div className={classes.done}>
                    <CompletedView
                        selectedShippingMethod={selectedShippingMethod}
                        showUpdateMode={showUpdateMode}
                    />
                </div>
                <UpdateModal
                    formInitialValues={updateFormInitialValues}
                    handleCancel={handleCancelUpdate}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    isOpen={isUpdateMode}
                    pageIsUpdating={pageIsUpdating}
                    setFormApi={setUpdateFormApi}
                    shippingMethods={shippingMethods}
                />
            </Fragment>
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
    pageIsUpdating: bool,
    setPageIsUpdating: func.isRequired
};

export default ShippingMethod;
