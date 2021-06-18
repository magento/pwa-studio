import React, { useCallback, useMemo } from 'react';
import { shape, string, bool, func } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import FormError from '@magento/venia-ui/lib/components/FormError';

import { useCheckmo } from '../talons/useCheckmo';
import defaultClasses from './checkmo.css';

/**
 * The CheckMo component renders all information to handle checkmo payment.
 *
 * @param {String} props.payableTo shop owner name where you need to send.
 * @param {String} props.mailingAddress shop owner post address where you need to send.
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onPaymentReady callback to invoke when the component is ready
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 */
const CheckMo = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        errors,
        initialValues,
        isBillingAddressSame,
        mailingAddress,
        payableTo,
        shippingAddressCountry
    } = useCheckmo(props);

    const { formatMessage } = useIntl();

    /**
     * These 2 functions are wrappers around the `isRequired` function
     * of `formValidators`. They perform validations only if the
     * billing address is different from shipping address.
     *
     * We write this function in `venia-ui` and not in the `peregrine` talon
     * because it references `isRequired` which is a `venia-ui` function.
     */
    const isFieldRequired = useCallback((value, { isBillingAddressSame }) => {
        if (isBillingAddressSame) {
            /**
             * Informed validator functions return `undefined` if
             * validation is `true`
             */
            return undefined;
        } else {
            return isRequired(value);
        }
    }, []);

    const addressTemplate = str => (
        <span key={str} className={classes.addressLine}>
            {str} <br />
        </span>
    );
    const formattedAddress = mailingAddress
        .split('\n')
        .map(str => addressTemplate(str));

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;
    /**
     * Instead of defining classes={root: classes.FIELD_NAME}
     * we are using useMemo to only do it once (hopefully).
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

    return (
        <div className={classes.root}>
            <FormError
                classes={{ root: classes.formErrorContainer }}
                errors={Array.from(errors.values())}
            />
            <div className={classes.checkmo_root}>
                <p className={classes.title}>
                    <FormattedMessage
                        id={'checkMo.payableToTitle'}
                        defaultMessage={'Make Check payable to:'}
                    />
                </p>
                <p className={classes.formatAddress}>
                    {payableTo ? payableTo : props.payableTo}
                </p>
                <p className={classes.mailingAddressTitle}>
                    <FormattedMessage
                        id={'checkMo.mailingAddressTitle'}
                        defaultMessage={'Send Check to:'}
                    />
                </p>
                <p className={classes.formatAddress}>{formattedAddress}</p>
                <p className={classes.note}>
                    <FormattedMessage
                        id={'checkMo.note'}
                        defaultMessage={
                            'Note: Your order will be shipped once the Check/Money Order has been received and processed.'
                        }
                    />
                </p>
            </div>
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
                    fieldInput={'region[label]'}
                    fieldSelect={'region[region_id]'}
                    optionValueKey={'id'}
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

CheckMo.propTypes = {
    classes: shape({ root: string }),
    payableTo: string,
    mailingAddress: string,
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

CheckMo.defaultProps = {
    payableTo: 'Venia Inc',
    mailingAddress: 'Venia Inc\r\nc/o Payment\r\nPO 122334\r\nAustin Texas'
};

export default CheckMo;
