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

import {
    GET_SHIPPING_METHODS,
    GET_SELECTED_SHIPPING_METHOD,
    SET_SHIPPING_METHOD
} from './shippingMethod.gql';

const ShippingMethod = props => {
    const { onSave, pageIsUpdating, setPageIsUpdating } = props;

    const talonProps = useShippingMethod({
        mutations: {
            setShippingMethod: SET_SHIPPING_METHOD
        },
        onSave,
        queries: {
            getShippingMethods: GET_SHIPPING_METHODS,
            getSelectedShippingMethod: GET_SELECTED_SHIPPING_METHOD
        },
        setPageIsUpdating
    });

    const {
        displayState,
        handleCancelUpdate,
        handleSubmit,
        isLoadingShippingMethods,
        isLoadingSelectedShippingMethod,
        isUpdateMode,
        selectedShippingMethod,
        shippingMethods,
        showUpdateMode
    } = talonProps;

    const isLoading =
        isLoadingSelectedShippingMethod || isLoadingShippingMethods;

    const classes = mergeClasses(defaultClasses, props.classes);

    let contents;
    switch (displayState) {
        case displayStates.EDITING:
            {
                const continueDisabled =
                    pageIsUpdating || !shippingMethods.length;

                contents = (
                    <div className={classes.root}>
                        <h3 className={classes.editingHeading}>
                            {'Shipping Method'}
                        </h3>
                        <Form className={classes.form} onSubmit={handleSubmit}>
                            <ShippingRadios
                                isLoading={isLoading}
                                selectedShippingMethod={selectedShippingMethod}
                                shippingMethods={shippingMethods}
                            />
                            {!isLoading && (
                                <div className={classes.formButtons}>
                                    <Button
                                        priority="normal"
                                        type="submit"
                                        disabled={continueDisabled}
                                    >
                                        {'Continue to Payment Information'}
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </div>
                );
            }
            break;

        case displayStates.DONE:
        default: {
            contents = (
                <div className={classes.done}>
                    <CompletedView
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                        showUpdateMode={showUpdateMode}
                    />
                </div>
            );
        }
    }

    return (
        <Fragment>
            {contents}
            <UpdateModal
                handleCancel={handleCancelUpdate}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isOpen={isUpdateMode}
                pageIsUpdating={pageIsUpdating}
                selectedShippingMethod={selectedShippingMethod}
                shippingMethods={shippingMethods}
            />
        </Fragment>
    );
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
