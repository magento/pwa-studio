import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from '../../css/forms.module.css';
import { Form } from 'informed';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasIntegerValue, hasEmail } from '../../util/formValidators';
import { useCreateAccountBeCustomer } from '../../talons/useCreateAccountBeCustomer';
import FormError from '@magento/venia-ui/lib/components/FormError';

const CreateAccountBeCustomer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const { successMsg, formErrors, isDisabledBtn, handleSendEmail } = useCreateAccountBeCustomer();

    const formMsg = successMsg ? (
        <div className={classes.formSuccess}>
            <FormattedMessage id={'createAccountBeCustomer.success'} defaultMessage={'Email send.'} />
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
                    id={'createAccountBeCustomer.title'}
                    defaultMessage={'Create an Account (Be customer)'}
                />
            </label>
            <Form className={classes.formContent} onSubmit={handleSendEmail}>
                {formMsg}
                <div className={classes.section}>
                    <label className={classes.titleSection}>
                        <FormattedMessage id={'createAccountBeCustomer.information'} defaultMessage={'Information'} />
                    </label>
                    <div className={classes.row}>
                        <Field
                            id="email"
                            label={formatMessage({ id: 'createAccountBeCustomer.email', defaultMessage: 'Email' })}
                        >
                            <TextInput field="email" validate={combine([isRequired, hasEmail])} />
                        </Field>
                        <Field
                            id="nif"
                            label={formatMessage({ id: 'createAccountBeCustomer.nif', defaultMessage: 'NIF' })}
                        >
                            <TextInput field="nif" validate={isRequired} />
                        </Field>
                    </div>
                    <div className={classes.row}>
                        <Field
                            id="nClient"
                            label={formatMessage({
                                id: 'createAccountBeCustomer.nClient',
                                defaultMessage: 'Nº of Client'
                            })}
                        >
                            <TextInput field="nClient" validate={combine([isRequired, hasIntegerValue])} />
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

export default CreateAccountBeCustomer;
