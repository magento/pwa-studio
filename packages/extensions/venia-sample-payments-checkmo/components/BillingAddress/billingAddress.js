import React, { useCallback, useMemo } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, func, bool } from 'prop-types';
import { useIntl } from 'react-intl';
import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './billingAddress.css';
import billingAddressOperations from './billingAddress.gql.js';
import { useBillingAddress } from '../../talons/useBillingAddress';

const BillingAddress = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const {
        shouldSubmit,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = props;

    const { mutations, queries } = billingAddressOperations;

    const {
        isBillingAddressSame,
        initialValues,
        shippingAddressCountry,
        errors
    } = useBillingAddress({
        shouldSubmit,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        mutations,
        queries
    });

    /**
     * Instead of defining classes={root: classes.FIELD_NAME}
     */
    const fieldClasses = useMemo(() => {
        return [
            'first_name',
            'last_name',
            'country',
            'street1',
            'street2',
            'city',
            'region',
            'postal_code',
            'phone_number'
        ].reduce((acc, fieldName) => {
            acc[fieldName] = { root: classes[fieldName] };

            return acc;
        }, {});
    }, [classes]);

    const isFieldRequired = useCallback(
        value => {
            if (isBillingAddressSame) {
                return undefined;
            } else {
                return isRequired(value);
            }
        },
        [isBillingAddressSame]
    );

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

    return (
        <div>
            <FormError
                classes={{ root: classes.formErrorContainer }}
                errors={Array.from(errors.values())}
            />
            <div className={classes.address_check}>
                <Checkbox
                    field="isBillingAddressSame"
                    label={formatMessage({
                        id: 'checkoutPage.billingAddressSame',
                        defaultMessage:
                            'Billing address same as shipping address'
                    })}
                    initialValue={initialValues.isBillingAddressSame}
                />
            </div>
            <div className={billingAddressFieldsClassName}>
                <Field
                    id="firstName"
                    classes={fieldClasses.first_name}
                    label={formatMessage({
                        id: 'global.firstName',
                        defaultMessage: 'First Name'
                    })}
                >
                    <TextInput
                        id="firstName"
                        field="firstName"
                        validate={isFieldRequired}
                        initialValue={initialValues.firstName}
                    />
                </Field>
                <Field
                    id="lastName"
                    classes={fieldClasses.last_name}
                    label={formatMessage({
                        id: 'global.lastName',
                        defaultMessage: 'Last Name'
                    })}
                >
                    <TextInput
                        id="lastName"
                        field="lastName"
                        validate={isFieldRequired}
                        initialValue={initialValues.lastName}
                    />
                </Field>
                <Country
                    classes={fieldClasses.country}
                    validate={isFieldRequired}
                    initialValue={
                        /**
                         * If there is no initial value to start with
                         * use the country from shipping address.
                         */
                        initialValues.country || shippingAddressCountry
                    }
                />
                <Field
                    id="street1"
                    classes={fieldClasses.street1}
                    label={formatMessage({
                        id: 'global.streetAddress',
                        defaultMessage: 'Street Address'
                    })}
                >
                    <TextInput
                        id="street1"
                        field="street1"
                        validate={isFieldRequired}
                        initialValue={initialValues.street1}
                    />
                </Field>
                <Field
                    id="street2"
                    classes={fieldClasses.street2}
                    label={formatMessage({
                        id: 'global.streetAddress2',
                        defaultMessage: 'Street Address 2'
                    })}
                    optional={true}
                >
                    <TextInput
                        id="street2"
                        field="street2"
                        initialValue={initialValues.street2}
                    />
                </Field>
                <Field
                    id="city"
                    classes={fieldClasses.city}
                    label={formatMessage({
                        id: 'global.city',
                        defaultMessage: 'City'
                    })}
                >
                    <TextInput
                        id="city"
                        field="city"
                        validate={isFieldRequired}
                        initialValue={initialValues.city}
                    />
                </Field>
                <Region
                    classes={fieldClasses.region}
                    initialValue={initialValues.region}
                    validate={isFieldRequired}
                />
                <Postcode
                    classes={fieldClasses.postal_code}
                    validate={isFieldRequired}
                    initialValue={initialValues.postcode}
                />
                <Field
                    id="phoneNumber"
                    classes={fieldClasses.phone_number}
                    label={formatMessage({
                        id: 'global.phoneNumber',
                        defaultMessage: 'Phone Number'
                    })}
                >
                    <TextInput
                        id="phoneNumber"
                        field="phoneNumber"
                        validate={isFieldRequired}
                        initialValue={initialValues.phoneNumber}
                    />
                </Field>
            </div>
        </div>
    );
};

BillingAddress.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onBillingAddressChangedError: func,
    onBillingAddressChangedSuccess: func
};

export default BillingAddress;
