import React, { Fragment, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, arrayOf, number } from 'prop-types';
import { AlertCircle } from 'react-feather';
import { useGuestForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useGuestForm';
import { useToasts } from '@magento/peregrine';

import { useStyle } from '../../../../classify';
import { isRequired } from '../../../../util/formValidators';
import Button from '../../../Button';
import Country from '../../../Country';
import Field, { Message } from '../../../Field';
import FormError from '../../../FormError';
import Region from '../../../Region';
import Postcode from '../../../Postcode';
import TextInput from '../../../TextInput';
import Icon from '../../../Icon';
import defaultClasses from './guestForm.module.css';

const AlertCircleIcon = <Icon src={AlertCircle} attrs={{ width: 20 }} />;

const GuestForm = props => {
    const {
        afterSubmit,
        classes: propClasses,
        onCancel,
        onSuccess,
        shippingData,
        toggleSignInContent,
        setGuestSignInUsername
    } = props;

    const talonProps = useGuestForm({
        afterSubmit,
        onCancel,
        onSuccess,
        shippingData,
        toggleSignInContent,
        setGuestSignInUsername
    });
    const {
        errors,
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving,
        isUpdate,
        handleValidateEmail,
        showSignInToast,
        handleToastAction
    } = talonProps;

    const formApiRef = useRef();
    const getFormApi = api => {
        formApiRef.current = api;
    };

    const [, { addToast }] = useToasts();

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    const guestEmailMessage = !isUpdate ? (
        <Message>
            <FormattedMessage
                id={'guestForm.emailMessage'}
                defaultMessage={
                    'Set a password at the end of guest checkout to create an account in one easy step.'
                }
            />
        </Message>
    ) : null;

    const cancelButton = isUpdate ? (
        <Button disabled={isSaving} onClick={handleCancel} priority="low">
            <FormattedMessage
                id={'global.cancelButton'}
                defaultMessage={'Cancel'}
            />
        </Button>
    ) : null;

    const submitButtonText = isUpdate
        ? formatMessage({
              id: 'global.updateButton',
              defaultMessage: 'Update'
          })
        : formatMessage({
              id: 'guestForm.continueToNextStep',
              defaultMessage: 'Continue to Shipping Method'
          });
    const submitButtonProps = {
        disabled: isSaving,
        priority: isUpdate ? 'high' : 'normal',
        type: 'submit'
    };

    useEffect(() => {
        if (showSignInToast) {
            addToast({
                type: 'info',
                icon: AlertCircleIcon,
                message: formatMessage({
                    id: 'checkoutPage.suggestSignInMessage',
                    defaultMessage:
                        'The email you provided is associated with an existing Venia account. Would you like to sign into this account?'
                }),
                timeout: false,
                dismissable: true,
                hasDismissAction: true,
                dismissActionText: formatMessage({
                    id: 'checkoutPage.suggestSignInDeclineMessage',
                    defaultMessage: 'No, thanks'
                }),
                actionText: formatMessage({
                    id: 'checkoutPage.suggestSignInConfirmMessage',
                    defaultMessage: 'Yes, sign in'
                }),
                onAction: removeToast =>
                    handleToastAction(
                        removeToast,
                        formApiRef.current.getValue('email')
                    )
            });
        }
    }, [addToast, formatMessage, showSignInToast, handleToastAction]);

    const shippingAddressError = JSON.stringify(
        errors.get('setGuestShippingMutation')
    );

    const errorMessage = 'Region is required';
    const regionError = shippingAddressError?.includes(errorMessage);

    return (
        <Fragment>
            <FormError errors={Array.from(errors.values())} />
            <Form
                className={classes.root}
                data-cy="GuestForm-root"
                initialValues={initialValues}
                onSubmit={handleSubmit}
                getApi={getFormApi}
            >
                <div className={classes.email}>
                    <Field
                        id="email"
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'Email'
                        })}
                    >
                        <TextInput
                            autoComplete={formatMessage({
                                id: 'shippingForm.shippingEmail',
                                defaultMessage: 'Shipping Email'
                            })}
                            field="email"
                            id="email"
                            data-cy="GuestForm-email"
                            validate={isRequired}
                            aria-label={formatMessage({
                                id: 'global.emailRequired',
                                defaultMessage: 'Email Required'
                            })}
                            onBlur={() =>
                                handleValidateEmail(
                                    formApiRef.current.getValue('email')
                                )
                            }
                            onPaste={e => {
                                const text = e.clipboardData.getData(
                                    'text/plain'
                                );
                                handleValidateEmail(text);
                            }}
                        />
                        {guestEmailMessage}
                    </Field>
                </div>
                <div className={classes.firstname}>
                    <Field
                        id="firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            autoComplete={formatMessage({
                                id: 'global.firstName',
                                defaultMessage: 'First Name'
                            })}
                            field="firstname"
                            id="firstname"
                            data-cy="GuestForm-firstName"
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
                        id="lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            autoComplete={formatMessage({
                                id: 'global.lastName',
                                defaultMessage: 'Last Name'
                            })}
                            field="lastname"
                            id="lastname"
                            data-cy="GuestForm-lastName"
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
                        autoComplete={formatMessage({
                            id: 'country.label',
                            defaultMessage: 'Country'
                        })}
                        validate={isRequired}
                        data-cy="GuestForm-country"
                        aria-label={formatMessage({
                            id: 'global.countryRequired',
                            defaultMessage: 'Country Required'
                        })}
                    />
                </div>
                <div className={classes.street0}>
                    <Field
                        id="street0"
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street Address'
                        })}
                    >
                        <TextInput
                            autoComplete={formatMessage({
                                id: 'global.streetAddress',
                                defaultMessage: 'Street Address'
                            })}
                            field="street[0]"
                            id="street0"
                            data-cy="GuestForm-street0"
                            validate={isRequired}
                            aria-label={formatMessage({
                                id: 'global.streetAddressRequired',
                                defaultMessage: 'Street Address Required'
                            })}
                        />
                    </Field>
                </div>
                <div className={classes.street1}>
                    <Field
                        id="street1"
                        label={formatMessage({
                            id: 'global.streetAddress2',
                            defaultMessage: 'Street Address 2'
                        })}
                        optional={true}
                    >
                        <TextInput
                            autoComplete={formatMessage({
                                id: 'global.streetAddress2',
                                defaultMessage: 'Street Address 2'
                            })}
                            field="street[1]"
                            id="street1"
                            data-cy="GuestForm-street1"
                        />
                    </Field>
                </div>
                <div className={classes.city}>
                    <Field
                        id="city"
                        label={formatMessage({
                            id: 'global.city',
                            defaultMessage: 'City'
                        })}
                    >
                        <TextInput
                            autoComplete={formatMessage({
                                id: 'global.city',
                                defaultMessage: 'City'
                            })}
                            field="city"
                            id="city"
                            data-cy="GuestForm-city"
                            validate={isRequired}
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
                        autoComplete={formatMessage({
                            id: 'region.label',
                            defaultMessage: 'State'
                        })}
                        fieldInput={'region[region]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey={'id'}
                        data-cy="GuestForm-region"
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
                        autoComplete={formatMessage({
                            id: 'postcode.label',
                            defaultMessage: 'ZIP / Postal Code'
                        })}
                        validate={isRequired}
                        data-cy="GuestForm-postcode"
                        aria-label={formatMessage({
                            id: 'global.postalCodeRequired',
                            defaultMessage: 'ZIP / Postal Code Required'
                        })}
                    />
                </div>
                <div className={classes.telephone}>
                    <Field
                        id="telephone"
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone Number'
                        })}
                    >
                        <TextInput
                            autoComplete={formatMessage({
                                id: 'global.phoneNumber',
                                defaultMessage: 'Phone Number'
                            })}
                            field="telephone"
                            id="telephone"
                            data-cy="GuestForm-telephone"
                            validate={isRequired}
                            aria-label={formatMessage({
                                id: 'global.phonenumberRequired',
                                defaultMessage: 'Phone Number Required'
                            })}
                        />
                    </Field>
                </div>
                <div className={classes.buttons}>
                    {cancelButton}
                    <Button
                        {...submitButtonProps}
                        data-cy="GuestForm-submitButton"
                    >
                        {submitButtonText}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default GuestForm;

GuestForm.defaultProps = {
    shippingData: {
        country: {
            code: DEFAULT_COUNTRY_CODE
        },
        region: {
            code: ''
        }
    }
};

GuestForm.propTypes = {
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
        submit: string,
        submit_update: string
    }),
    onCancel: func,
    onSuccess: func.isRequired,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        email: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: shape({
            region_id: number,
            region: string
        }).isRequired,
        street: arrayOf(string),
        telephone: string
    }),
    toggleSignInContent: func.isRequired,
    setGuestSignInUsername: func.isRequired
};
