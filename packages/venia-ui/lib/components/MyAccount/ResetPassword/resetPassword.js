import React, { useEffect } from 'react';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine';
import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword';

import { mergeClasses } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import FormErrors from '../../FormError';
import { Title } from '../../Head';
import Password from '../../Password';
import TextInput from '../../TextInput';
import defaultClasses from './resetPassword.css';
import resetPasswordOperations from './resetPassword.gql';

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
        token,
        formErrors,
        handleSubmit
    } = talonProps;

    const tokenMissing = (
        <div className={classes.invalidTokenContainer}>
            <div className={classes.invalidToken}>
                {'Uh oh, something went wrong. Check the link or try again.'}
            </div>
        </div>
    );

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasCompleted) {
            addToast({
                type: 'info',
                message: 'Your new password has been saved.',
                timeout: 5000
            });
        }
    }, [addToast, hasCompleted]);

    const recoverPassword = hasCompleted ? (
        <div className={classes.successMessageContainer}>
            <div className={classes.successMessage}>
                {
                    'Your new password has been saved. Please use this password to sign into your Account.'
                }
            </div>
        </div>
    ) : (
        <Form className={classes.container} onSubmit={handleSubmit}>
            <div className={classes.description}>
                Please enter your email address and new password.
            </div>
            <Field label={'Email address'}>
                <TextInput field={'email'} validate={isRequired} />
            </Field>
            <Password
                classes={{ root: classes.password }}
                label={'New Password'}
                fieldName={'newPassword'}
                isToggleButtonHidden={false}
            />
            <Button
                className={classes.submitButton}
                type="submit"
                priority="high"
                disabled={loading}
            >
                {'Save Password'}
            </Button>
            <FormErrors
                classes={{ root: classes.errorMessage }}
                errors={formErrors}
            />
        </Form>
    );

    return (
        <div className={classes.root}>
            <Title>{`${PAGE_TITLE} - ${STORE_NAME}`}</Title>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            {token ? recoverPassword : tokenMissing}
        </div>
    );
};

export default ResetPassword;

ResetPassword.propTypes = {
    classes: shape({
        container: string,
        description: string,
        errorMessage: string,
        heading: string,
        invalidToken: string,
        invalidTokenContainer: string,
        password: string,
        root: string,
        submitButton: string,
        successMessage: string,
        successMessageContainer: string
    })
};
