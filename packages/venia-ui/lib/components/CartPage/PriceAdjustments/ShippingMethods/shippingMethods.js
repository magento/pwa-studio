import React, { Fragment } from 'react';
import { Form } from 'informed';
import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';

import { mergeClasses } from '../../../../classify';
import Button from '../../../Button';
import ShippingForm from './shippingForm';
import defaultClasses from './shippingMethods.css';
import ShippingMethodsOperations from './shippingMethods.gql';
import ShippingRadios from './shippingRadios';

const ShippingMethods = props => {
    const { setIsCartUpdating } = props;
    const {
        hasMethods,
        isShowingForm,
        selectedShippingFields,
        selectedShippingMethod,
        shippingMethods,
        showForm
    } = useShippingMethods({ ...ShippingMethodsOperations });

    const classes = mergeClasses(defaultClasses, props.classes);

    const radios =
        isShowingForm && hasMethods ? (
            <Fragment>
                <h3 className={classes.prompt}>Shipping Methods</h3>
                <Form>
                    <ShippingRadios
                        selectedShippingMethod={selectedShippingMethod}
                        setIsCartUpdating={setIsCartUpdating}
                        shippingMethods={shippingMethods}
                    />
                </Form>
            </Fragment>
        ) : null;

    const formOrPlaceholder = isShowingForm ? (
        <Fragment>
            <ShippingForm
                hasMethods={hasMethods}
                selectedShippingFields={selectedShippingFields}
                setIsCartUpdating={setIsCartUpdating}
            />
            {radios}
        </Fragment>
    ) : (
        <Button
            classes={{ root_lowPriority: classes.estimateLink }}
            priority="low"
            type="button"
            onClick={showForm}
        >
            I want to estimate my shipping
        </Button>
    );

    return (
        <div className={classes.root}>
            <p className={classes.message}>
                For shipping estimates before proceeding to checkout, please
                provide the Country, State, and ZIP for the destination of your
                order.
            </p>
            {formOrPlaceholder}
        </div>
    );
};

export default ShippingMethods;
