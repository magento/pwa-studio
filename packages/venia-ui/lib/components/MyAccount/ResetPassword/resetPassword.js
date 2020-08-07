import React from 'react';
import { Form } from 'informed';

import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { Title } from '../../Head';
import Field from '../../Field';
import TextInput from '../../TextInput';
import Button from '../../Button';
import FormErrors from '../../FormError';
import { isRequired } from '../../../util/formValidators';

import resetPasswordOperations from './resetPassword.gql';

import defaultClasses from './resetPassword.css';

const PAGE_TITLE = `Reset Password`;

const ResetPassword = props => {
    const { classes: propClasses } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const talonProps = useResetPassword({
        ...resetPasswordOperations
    });
    const {
        hasCompleted,
        loading,
        email,
        token,
        formErrors,
        handleSubmit
    } = talonProps;

    const tokenMissing = (
        <div className={classes.invalidToken}>
            Token missing. Error message TODO.
        </div>
    );

    const recoverPassword = hasCompleted ? (
        <div className={classes.successMessage}>
            {
                'Your new password has been saved. Please use this password to sign into your Account.'
            }
        </div>
    ) : (
        <Form className={classes.container} onSubmit={handleSubmit}>
            <h2 className={classes.description}>
                Please enter your new password.
            </h2>
            <Field label="New Password" classes={{ root: classes.password }}>
                <TextInput
                    field="newPassword"
                    type="password"
                    validate={isRequired}
                />
            </Field>
            <Button
                className={classes.submitButton}
                type="submit"
                priority="high"
                disabled={loading}
            >
                {'SAVE'}
            </Button>
            <FormErrors errors={formErrors} />
        </Form>
    );

    return (
        <div className={classes.root}>
            <Title>{`${PAGE_TITLE} - ${STORE_NAME}`}</Title>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            {token && email ? recoverPassword : tokenMissing}
        </div>
    );
};

export default ResetPassword;
