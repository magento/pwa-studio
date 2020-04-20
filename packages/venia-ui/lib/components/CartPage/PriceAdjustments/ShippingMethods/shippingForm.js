import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import { useShippingForm } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

import { mergeClasses } from '../../../../classify';
import { isRequired } from '../../../../util/formValidators';
import Button from '../../../Button';
import { ShippingInformationFragment } from '../../../CheckoutPage/ShippingInformation/shippingInformationFragments.gql';
import Country from '../../../Country';
import Field from '../../../Field';
import Region from '../../../Region';
import TextInput from '../../../TextInput';
import { CartPageFragment } from '../../cartPageFragments.gql';
import defaultClasses from './shippingForm.css';
import { GET_SHIPPING_METHODS } from './shippingMethods';
import { ShippingMethodsFragment } from './shippingMethodsFragments';

const ShippingForm = props => {
    const { hasMethods, selectedShippingFields, setIsCartUpdating } = props;
    const talonProps = useShippingForm({
        selectedValues: selectedShippingFields,
        setIsCartUpdating,
        mutations: {
            setShippingAddressMutation: SET_SHIPPING_ADDRESS_MUTATION
        },
        queries: {
            shippingMethodsQuery: GET_SHIPPING_METHODS
        }
    });
    const {
        handleOnSubmit,
        handleZipChange,
        isSetShippingLoading
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <h3 className={classes.formTitle}>Destination</h3>
            <Form
                className={classes.root}
                initialValues={selectedShippingFields}
                onSubmit={handleOnSubmit}
            >
                <Country validate={isRequired} />
                <Region validate={isRequired} />
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
        zip: string
    }),
    selectedShippingFields: shape({
        country: string.isRequired,
        region: string.isRequired,
        zip: string.isRequired
    }),
    setIsFetchingMethods: func
};

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
        ) @connection(key: "setShippingAddressesOnCart") {
            cart {
                id
                ...CartPageFragment
                ...ShippingMethodsFragment
                ...ShippingInformationFragment
            }
        }
    }
    ${CartPageFragment}
    ${ShippingMethodsFragment}
    ${ShippingInformationFragment}
`;
