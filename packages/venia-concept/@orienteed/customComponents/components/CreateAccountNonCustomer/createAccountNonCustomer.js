import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import Countries from '../Countries/countries';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from '../../css/forms.module.css';
import { Form } from 'informed';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasIntegerValue, hasEmail } from '../../util/formValidators';
import { useCreateAccountNonCustomer } from '../../talons/useCreateAccountNonCustomer';
import FormError from '@magento/venia-ui/lib/components/FormError';

const CreateAccountNonCustomer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const { successMsg, formErrors, isDisabledBtn, handleSendEmail } = useCreateAccountNonCustomer();

    const formMsg = successMsg ? (
        <div className={classes.formSuccess}>
            <FormattedMessage id={'createAccountNonCustomer.success'} defaultMessage={'Email send.'} />
        </div>
    ) : (
        <FormError
            classes={{
                root: classes.formErrors
            }}
            errors={formErrors}
        />
    );

    return (
        <div className={classes.content}>
            <label className={classes.title}>
                <FormattedMessage
                    id={'createAccountNonCustomer.title'}
                    defaultMessage={'Create an Account (Non customer)'}
                />
            </label>
            <Form className={classes.formContent} onSubmit={handleSendEmail}>
                {formMsg}

                <div className={classes.section}>
                    <label className={classes.titleSection}>
                        <FormattedMessage id={'createAccountNonCustomer.information'} defaultMessage={'Information'} />
                    </label>
                    <div className={classes.row}>
                        <Field
                            id="name"
                            label={formatMessage({ id: 'createAccountNonCustomer.name', defaultMessage: 'Name' })}
                        >
                            <TextInput field="name" validate={isRequired} />
                        </Field>
                        <Field
                            id="nif"
                            label={formatMessage({ id: 'createAccountNonCustomer.nif', defaultMessage: 'NIF' })}
                        >
                            <TextInput field="nif" validate={isRequired} />
                        </Field>
                    </div>
                </div>

                <div className={classes.section}>
                    <label className={classes.titleSection}>
                        <FormattedMessage id={'createAccountNonCustomer.location'} defaultMessage={'Location'} />
                    </label>
                    <div className={classes.row}>
                        <Field
                            id="address1"
                            label={formatMessage({
                                id: 'createAccountNonCustomer.address1',
                                defaultMessage: 'Address 1'
                            })}
                        >
                            <TextInput field="address1" validate={isRequired} />
                        </Field>
                        <Field
                            id="address2"
                            label={formatMessage({
                                id: 'createAccountNonCustomer.address2',
                                defaultMessage: 'Address 2'
                            })}
                        >
                            <TextInput field="address2" validate={isRequired} />
                        </Field>
                    </div>

                    <div className={classes.row}>
                        <Field
                            id="postalCode"
                            label={formatMessage({
                                id: 'createAccountNonCustomer.postalCode',
                                defaultMessage: 'Postal Code'
                            })}
                        >
                            <TextInput field="postalCode" validate={combine([isRequired, hasIntegerValue])} />
                        </Field>
                        <Field
                            id="population"
                            label={formatMessage({
                                id: 'createAccountNonCustomer.population',
                                defaultMessage: 'Population'
                            })}
                        >
                            <TextInput field="population" validate={combine([isRequired, hasIntegerValue])} />
                        </Field>
                    </div>

                    <div className={classes.row}>
                        <Field
                            id="province"
                            label={formatMessage({
                                id: 'createAccountNonCustomer.province',
                                defaultMessage: 'Province'
                            })}
                        >
                            <TextInput field="province" validate={isRequired} />
                        </Field>
                        <Field
                            id="country"
                            label={formatMessage({ id: 'createAccountNonCustomer.country', defaultMessage: 'Country' })}
                        >
                            <Countries field="country" />
                        </Field>
                    </div>
                </div>

                <div className={classes.section}>
                    <label className={classes.titleSection}>
                        <FormattedMessage id={'createAccountNonCustomer.contact'} defaultMessage={'Contact'} />
                    </label>
                    <div className={classes.row}>
                        <Field
                            id="contactName"
                            label={formatMessage({
                                id: 'createAccountNonCustomer.contactName',
                                defaultMessage: 'Contact Name'
                            })}
                        >
                            <TextInput field="contactName" validate={isRequired} />
                        </Field>
                        <Field
                            id="phone"
                            label={formatMessage({ id: 'createAccountNonCustomer.phone', defaultMessage: 'Phone' })}
                        >
                            <TextInput field="phone" validate={combine([isRequired, hasIntegerValue])} />
                        </Field>
                    </div>
                    <div className={classes.row}>
                        <Field
                            id="email"
                            label={formatMessage({ id: 'createAccountNonCustomer.email', defaultMessage: 'Email' })}
                        >
                            <TextInput field="email" validate={combine([isRequired, hasEmail])} />
                        </Field>
                    </div>
                </div>
                <Button priority="normal" type="submit" disabled={isDisabledBtn}>
                    <FormattedMessage id={'createAccountNonCustomer.sent'} defaultMessage={'Sent email'} />
                </Button>
            </Form>
        </div>
    );
};

export default CreateAccountNonCustomer;
