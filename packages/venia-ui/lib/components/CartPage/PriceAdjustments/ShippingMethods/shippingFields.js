import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { useShippingFields } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingFields';

import { mergeClasses } from '../../../../classify';
import Field from '../../../Field';
import Select from '../../../Select';
import TextInput from '../../../TextInput';
import defaultClasses from './shippingFields.css';
import { ShippingMethodsFragment } from './shippingMethodsFragments';

const DEFAULT_COUNTRY = 'US';

const ShippingFields = props => {
    const {
        countries,
        handleZipOnBlur,
        isCountriesLoading,
        states
    } = useShippingFields({
        getCountriesQuery: GET_COUNTRIES_QUERY,
        getStatesQuery: GET_STATES_QUERY,
        setShippingMutation: SET_SHIPPING_MUTATION
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <Field
                id="country"
                label="Country"
                classes={{ root: classes.country }}
            >
                <Select
                    disabled={isCountriesLoading ? true : null}
                    field="country"
                    initialValue={DEFAULT_COUNTRY}
                    items={countries}
                />
            </Field>
            <Field id="state" label="State" classes={{ root: classes.state }}>
                <Select field="state" items={states} />
            </Field>
            <Field id="zip" label="ZIP" classes={{ root: classes.zip }}>
                <TextInput field="zip" onBlur={handleZipOnBlur} />
            </Field>
        </Fragment>
    );
};

export default ShippingFields;

export const GET_COUNTRIES_QUERY = gql`
    query GetCountries {
        countries {
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

export const SET_SHIPPING_MUTATION = gql`
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
                ...ShippingMethodsFragment
            }
        }
    }
    ${ShippingMethodsFragment}
`;
