import React, { Fragment } from 'react';
import gql from 'graphql-tag';
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
import { ShippingMethodsFragment } from './shippingMethodsFragments';
import { CartPageFragment } from '../../cartPageFragments';
import { GET_SHIPPING_METHODS } from './shippingMethods';

const ShippingForm = props => {
    const { hasMethods, selectedShippingFields, setIsCartUpdating } = props;

    const {
        countries,
        handleCountryChange,
        handleOnSubmit,
        handleZipChange,
        isCountriesLoading,
        isSetShippingLoading,
        states
    } = useShippingForm({
        selectedValues: selectedShippingFields,
        setIsCartUpdating,
        mutations: {
            setShippingAddressMutation: SET_SHIPPING_ADDRESS_MUTATION
        },
        queries: {
            getCountriesQuery: GET_COUNTRIES_QUERY,
            getStatesQuery: GET_STATES_QUERY,
            shippingMethodsQuery: GET_SHIPPING_METHODS
        }
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

export const GET_COUNTRIES_QUERY = gql`
    query GetCountries {
        countries {
            id
            full_name_english
            two_letter_abbreviation
        }
    }
`;

export const GET_STATES_QUERY = gql`
    query GetStates($countryCode: String!) {
        country(id: $countryCode) {
            id
            available_regions {
                id
                code
                name
            }
        }
    }
`;

export const SET_SHIPPING_ADDRESS_MUTATION = gql`
    mutation SetShippingAddressForEstimate(
        $cartId: String!
        $address: CartAddressInput!
    ) {
        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ address: $address }]
            }
        ) {
            cart {
                id
                ...CartPageFragment
                ...ShippingMethodsFragment
            }
        }
    }
    ${CartPageFragment}
    ${ShippingMethodsFragment}
`;
