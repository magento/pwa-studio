import React, { useCallback, useMemo } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string, func, bool } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './billingAddress.module.css';

import { useBillingAddress } from '@magento/peregrine/lib/talons/CheckoutPage/BillingAddress/useBillingAddress';

const BillingAddress = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const { shouldSubmit, onBillingAddressChangedError, onBillingAddressChangedSuccess, checkoutStep } = props;

    const { isBillingAddressDefault, initialValues, shippingAddressCountry, errors, locationLabel } = useBillingAddress(
        {
            shouldSubmit,
            onBillingAddressChangedError,
            onBillingAddressChangedSuccess
        }
    );

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

    /**
     * These 2 functions are wrappers around the `isRequired` function
     * of `formValidators`. They perform validations only if the
     * billing address is different from shipping address.
     */
    const isFieldRequired = useCallback((value, { isBillingAddressDefault }) => {
        if (isBillingAddressDefault) {
            /**
             * Informed validator functions return `undefined` if
             * validation is `true`
             */
            return undefined;
        } else {
            return isRequired(value);
        }
    }, []);

    const billingAddressFieldsClassName = isBillingAddressDefault
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

    const isBillingAddressDefaultHtml = useMemo(() => {
        if (initialValues.isBillingAddressDefault) {
            return (
                <h2 className={classes.address_check}>
                    <FormattedMessage
                        id={'checkoutPage.billingAddressDefault'}
                        defaultMessage={'Your default billing address will be used for this order'}
                    />
                </h2>
            );
        }
        return null;
    }, [initialValues, classes]);

    return (
        <>
            <h5 className={classes.heading}>
                <FormattedMessage id={'billingAddress.label'} defaultMessage={'Billing Address'} />
            </h5>
            {checkoutStep <= 3 ? (
                <div className={classes.formContainer}>
                    <FormError classes={{ root: classes.formErrorContainer }} errors={Array.from(errors.values())} />
                    {isBillingAddressDefaultHtml}
                    <div className={billingAddressFieldsClassName}>
                        <Field
                            id="firstName"
                            classes={fieldClasses.first_name}
                            label={formatMessage({
                                id: 'global.companyName',
                                defaultMessage: 'Company Name'
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
                                initialValue={'lastname'}
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
                            <TextInput id="street2" field="street2" initialValue={initialValues.street2} />
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
            ) : (
                <>
                    <div>
                        <span>
                            <FormattedMessage id={'global.companyName'} defaultMessage="Company Name" />: &nbsp;
                        </span>
                        <span>
                            {isBillingAddressDefault
                                ? initialValues?.defaultBillingAddressObject.firstname
                                : initialValues.firstName}
                        </span>
                    </div>{' '}
                    <div>
                        <span>
                            <FormattedMessage id={'country.label'} defaultMessage="Country" />: &nbsp;
                        </span>
                        <span>
                            {isBillingAddressDefault
                                ? initialValues?.defaultBillingAddressObject.country_code
                                : locationLabel.country}
                        </span>
                    </div>
                    <div>
                        <span>
                            <FormattedMessage id={'global.streetAddress'} defaultMessage="Street Address" />: &nbsp;
                        </span>
                        <span>
                            {isBillingAddressDefault
                                ? initialValues?.defaultBillingAddressObject?.street[0]
                                : initialValues.street1}
                        </span>
                    </div>
                    {(initialValues?.defaultBillingAddressObject?.street?.length > 1 || initialValues.street2) && (
                        <div>
                            <span>
                                <FormattedMessage id={'global.streetAddress2'} defaultMessage="Street Address 2" />:
                                &nbsp;
                            </span>
                            <span>
                                {isBillingAddressDefault
                                    ? initialValues?.defaultBillingAddressObject.street[1]
                                    : initialValues.street2}
                            </span>
                        </div>
                    )}
                    <div>
                        <span>
                            <FormattedMessage id={'global.city'} defaultMessage="City" />: &nbsp;
                        </span>
                        <span>
                            {isBillingAddressDefault
                                ? initialValues?.defaultBillingAddressObject.city
                                : initialValues.city}
                        </span>
                    </div>
                    <div>
                        <span>
                            <FormattedMessage id={'region.label'} defaultMessage="State" />: &nbsp;
                        </span>
                        <span>
                            {isBillingAddressDefault
                                ? initialValues?.defaultBillingAddressObject?.region.region
                                : locationLabel.region || initialValues.region}
                        </span>
                    </div>
                    <div>
                        <span>
                            <FormattedMessage id={'postcode.label'} defaultMessage="ZIP / Postal Code" />: &nbsp;
                        </span>
                        <span>
                            {isBillingAddressDefault
                                ? initialValues?.defaultBillingAddressObject.postcode
                                : initialValues.postcode}
                        </span>
                    </div>
                    <div>
                        <span>
                            <FormattedMessage id={'global.phoneNumber'} defaultMessage="Phone Number" />: &nbsp;
                        </span>
                        <span>
                            {isBillingAddressDefault
                                ? initialValues?.defaultBillingAddressObject.telephone
                                : initialValues.phoneNumber}
                        </span>
                    </div>
                </>
            )}
        </>
    );
};

BillingAddress.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onBillingAddressChangedError: func,
    onBillingAddressChangedSuccess: func
};

export default BillingAddress;
