import React from 'react';
import { Form } from 'informed';

import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { Title } from '../../Head';
import Field from '../../Field';
import TextInput from '../../TextInput';
import Button from '../../Button';
import { isRequired } from '../../../util/formValidators';

import defaultClasses from './resetPassword.css';

const PAGE_TITLE = `Reset Password`;

const ResetPassword = props => {
    const { classes: propClasses } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const { token, handleSubmit } = useResetPassword();

    const tokenMissing = (
        <div className={classes.invalidToken}>
            Token missing. Error message TODO.
        </div>
    );

    const recoverPassword = (
        <Form className={classes.container} onSubmit={handleSubmit}>
            <h2 className={classes.description}>
                Please enter your new password.
            </h2>
            <Field label="New Password" className={classes.password}>
                <TextInput
                    field="password"
                    type="password"
                    validate={isRequired}
                />
            </Field>
            <Button
                className={classes.submitButton}
                type="submit"
                priority="high"
            >
                {'SAVE'}
            </Button>
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
