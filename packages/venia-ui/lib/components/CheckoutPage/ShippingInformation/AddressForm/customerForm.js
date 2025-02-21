import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Text } from 'informed';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { useCustomerForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useCustomerForm';

import { useStyle } from '../../../../classify';
import { isRequired } from '../../../../util/formValidators';
import Button from '../../../Button';
import Checkbox from '../../../Checkbox';
import Country from '../../../Country';
import Field, { Message } from '../../../Field';
import FormError from '../../../FormError';
import Region from '../../../Region';
import Postcode from '../../../Postcode';
import TextInput from '../../../TextInput';
import defaultClasses from './customerForm.module.css';
import LoadingIndicator from '../../../LoadingIndicator';

const CustomerForm = props => {
    const {
        afterSubmit,
        classes: propClasses,
        onCancel,
        onSuccess,
        shippingData
    } = props;

    const talonProps = useCustomerForm({
        afterSubmit,
        onCancel,
        onSuccess,
        shippingData
    });
    const {
        errors,
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading,
        isSaving,
        isUpdate
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'customerForm.loading'}
                    defaultMessage={'Fetching Customer Details...'}
                />
            </LoadingIndicator>
        );
    }

    const emailRow = !hasDefaultShipping ? (
        <div className={classes.email}>
            <Field
                id="email"
                label={formatMessage({
                    id: 'global.email',
                    defaultMessage: 'Email'
                })}
            >
                <TextInput
                    disabled={true}
                    field="email"
                    id="email"
                    validate={isRequired}
                />
            </Field>
        </div>
    ) : null;

    const formMessageRow = !hasDefaultShipping ? (
        <div data-cy="CustomerForm-formMessage" className={classes.formMessage}>
            <Message>
                <FormattedMessage
                    id={'customerForm.formMessage'}
                    defaultMessage={
                        'The shipping address you enter will be saved to your address book and set as your default for future purchases.'
                    }
                />
            </Message>
        </div>
    ) : null;

    const cancelButton = isUpdate ? (
        <Button disabled={isSaving} onClick={handleCancel} priority="low">
            <FormattedMessage
                id={'global.cancelButton'}
                defaultMessage={'Cancel'}
            />
        </Button>
    ) : null;

    const submitButtonText = !hasDefaultShipping
        ? formatMessage({
              id: 'global.saveAndContinueButton',
              defaultMessage: 'Save and Continue'
          })
        : isUpdate
        ? formatMessage({
              id: 'global.updateButton',
              defaultMessage: 'Update'
          })
        : formatMessage({
              id: 'global.addButton',
              defaultMessage: 'Add'
          });
    const submitButtonProps = {
        disabled: isSaving,
        priority: !hasDefaultShipping ? 'normal' : 'high',
        type: 'submit'
    };

    const defaultShippingElement = hasDefaultShipping ? (
        <div className={classes.defaultShipping}>
            <Checkbox
                disabled={!!initialValues.default_shipping}
                id="default_shipping"
                data-cy="CustomerForm-defaultShipping"
                field="default_shipping"
                label={formatMessage({
                    id: 'customerForm.defaultShipping',
                    defaultMessage: 'Make this my default address'
                })}
            />
        </div>
    ) : (
        <Text type="hidden" field="default_shipping" initialValue={true} />
    );

    const createErrorMessage = JSON.stringify(
        errors.get('createCustomerAddressMutation')
    );
    const updateErrorMessage = JSON.stringify(
        errors.get('updateCustomerAddressMutation')
    );
    const errorMessage = 'region_id is required for the specified country code';
    const regionError =
        createErrorMessage?.includes(errorMessage) ||
        updateErrorMessage?.includes(errorMessage);

    // errors
    return (
        <Fragment>
            <FormError errors={Array.from(errors.values())} />
            <Form
                className={classes.root}
                data-cy="CustomerForm-root"
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {formMessageRow}
                {emailRow}
                <div className={classes.firstname}>
                    <Field
                        id="customer_firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            disabled={!hasDefaultShipping}
                            field="firstname"
                            id="customer_firstname"
                            data-cy="CustomerForm-firstName"
                            validate={isRequired}
                            aria-label={formatMessage({
                                id: 'global.firstNameRequired',
                                defaultMessage: 'First Name Required'
                            })}
                        />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field
                        id="customer_lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            disabled={!hasDefaultShipping}
                            field="lastname"
                            id="customer_lastname"
                            data-cy="CustomerForm-lastName"
                            validate={isRequired}
                            aria-label={formatMessage({
                                id: 'global.lastNameRequired',
                                defaultMessage: 'Last Name Required'
                            })}
                        />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country
                        validate={isRequired}
                        data-cy="CustomerForm-country"
                        aria-label={formatMessage({
                            id: 'global.countryRequired',
                            defaultMessage: 'Country Required'
                        })}
                    />
                </div>
                <div className={classes.street0}>
                    <Field
                        id="customer_street0"
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street Address'
                        })}
                    >
                        <TextInput
                            field="street[0]"
                            validate={isRequired}
                            id="customer_street0"
                            data-cy="CustomerForm-street0"
                            aria-label={formatMessage({
                                id: 'global.streetAddressRequired',
                                defaultMessage: 'Street Address Required'
                            })}
                        />
                    </Field>
                </div>
                <div className={classes.street1}>
                    <Field
                        id="customer_street1"
                        label={formatMessage({
                            id: 'global.streetAddress2',
                            defaultMessage: 'Street Address 2'
                        })}
                        optional={true}
                    >
                        <TextInput
                            field="street[1]"
                            id="customer_street1"
                            data-cy="CustomerForm-street1"
                        />
                    </Field>
                </div>
                <div className={classes.city}>
                    <Field
                        id="customer_city"
                        label={formatMessage({
                            id: 'global.city',
                            defaultMessage: 'City'
                        })}
                        aria-label={formatMessage({
                            id: 'global.countryRequired',
                            defaultMessage: 'Country Required'
                        })}
                    >
                        <TextInput
                            field="city"
                            validate={isRequired}
                            id="customer_city"
                            data-cy="CustomerForm-city"
                            aria-label={formatMessage({
                                id: 'global.cityRequired',
                                defaultMessage: 'City Required'
                            })}
                        />
                    </Field>
                </div>

                <div className={classes.region}>
                    <Region
                        regionError={regionError}
                        data-cy="CustomerForm-region"
                        fieldInput={'region[region]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey={'id'}
                        aria-label={formatMessage({
                            id: 'global.stateRequired',
                            defaultMessage: 'State Required'
                        })}
                    />
                    {regionError ? (
                        <Message>
                            <div className={classes.regionError}>
                                <FormattedMessage
                                    id={'validation.isRequired'}
                                    defaultMessage={'isRequired'}
                                />
                            </div>
                        </Message>
                    ) : (
                        ''
                    )}
                </div>

                <div className={classes.postcode}>
                    <Postcode
                        validate={isRequired}
                        data-cy="CustomerForm-postcode"
                        aria-label={formatMessage({
                            id: 'global.postalCodeRequired',
                            defaultMessage: 'ZIP / Postal Code Required'
                        })}
                    />
                </div>
                <div className={classes.telephone}>
                    <Field
                        id="customer_telephone"
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone Number'
                        })}
                    >
                        <TextInput
                            field="telephone"
                            validate={isRequired}
                            id="customer_telephone"
                            data-cy="CustomerForm-telephone"
                            aria-label={formatMessage({
                                id: 'global.phonenumberRequired',
                                defaultMessage: 'Phone Number Required'
                            })}
                        />
                    </Field>
                </div>
                {defaultShippingElement}
                <div className={classes.buttons}>
                    {cancelButton}
                    <Button
                        {...submitButtonProps}
                        data-cy="CustomerForm-submitButton"
                    >
                        {submitButtonText}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default CustomerForm;

CustomerForm.defaultProps = {
    shippingData: {
        country: {
            code: DEFAULT_COUNTRY_CODE
        },
        region: {
            id: null
        }
    }
};

CustomerForm.propTypes = {
    afterSubmit: func,
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        country: string,
        street0: string,
        street1: string,
        city: string,
        region: string,
        postcode: string,
        telephone: string,
        buttons: string,
        formMessage: string,
        defaultShipping: string
    }),
    onCancel: func,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        default_shipping: bool,
        email: string,
        firstname: string,
        id: number,
        lastname: string,
        postcode: string,
        region: shape({
            id: number
        }).isRequired,
        street: arrayOf(string),
        telephone: string
    })
};
