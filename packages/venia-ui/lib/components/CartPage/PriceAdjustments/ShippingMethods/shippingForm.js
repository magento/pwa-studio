import React, { Fragment } from 'react';
import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import { useShippingForm } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

import { mergeClasses } from '../../../../classify';
import { isRequired } from '../../../../util/formValidators';
import Button from '../../../Button';
import Field from '../../../Field';
import Select from '../../../Select';
import TextInput from '../../../TextInput';
import defaultClasses from './shippingForm.css';
import { GET_SHIPPING_METHODS } from './shippingMethods.graphql';
import {
    GET_COUNTRIES_QUERY,
    GET_STATES_QUERY,
    SET_SHIPPING_ADDRESS_MUTATION
} from './shippingForm.graphql';

const ShippingForm = props => {
    const { hasMethods, selectedShippingFields } = props;

    const {
        countries,
        handleCountryChange,
        handleOnSubmit,
        handleZipChange,
        isCountriesLoading,
        isSetShippingLoading,
        states
    } = useShippingForm({
        getCountriesQuery: GET_COUNTRIES_QUERY,
        getStatesQuery: GET_STATES_QUERY,
        selectedValues: selectedShippingFields,
        setShippingAddressMutation: SET_SHIPPING_ADDRESS_MUTATION,
        shippingMethodsQuery: GET_SHIPPING_METHODS
    });

    const classes = mergeClasses(defaultClasses, props.classes);
    const stateProps = {
        field: 'state',
        validate: isRequired
    };
    const stateField = states.length ? (
        <Select {...stateProps} items={states} />
    ) : (
        <TextInput {...stateProps} />
    );

    return (
        <Fragment>
            <h3 className={classes.formTitle}>Destination</h3>
            <Form
                className={classes.root}
                initialValues={selectedShippingFields}
                onSubmit={handleOnSubmit}
            >
                <Field
                    id="country"
                    label="Country"
                    classes={{ root: classes.country }}
                >
                    <Select
                        disabled={isCountriesLoading}
                        field="country"
                        items={countries}
                        onValueChange={handleCountryChange}
                        validate={isRequired}
                    />
                </Field>
                <Field
                    id="state"
                    label="State"
                    classes={{ root: classes.state }}
                >
                    {stateField}
                </Field>
                <Field id="zip" label="ZIP" classes={{ root: classes.zip }}>
                    <TextInput
                        field="zip"
                        validate={isRequired}
                        onValueChange={handleZipChange}
                    />
                </Field>
                {!hasMethods ? (
                    <Button
                        classes={{ root_normalPriority: classes.submit }}
                        disabled={isSetShippingLoading}
                        priority="normal"
                        type="submit"
                    >
                        {isSetShippingLoading
                            ? 'Loading Methods...'
                            : 'Get Shipping Options'}
                    </Button>
                ) : null}
            </Form>
        </Fragment>
    );
};

export default ShippingForm;

ShippingForm.propTypes = {
    classes: shape({
        country: string,
        state: string,
        zip: string
    }),
    selectedShippingFields: shape({
        country: string.isRequired,
        state: string.isRequired,
        zip: string.isRequired
    }),
    setIsFetchingMethods: func
};
