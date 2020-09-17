import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Field from '../Field';
import LinkButton from '../LinkButton';
import Password from '../Password';
import TextInput from '../TextInput';

import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField
} from '../../util/formValidators';
import combine from '../../util/combineValidators';
import defaultClasses from './editForm.css';

const EditForm = props => {
    const {
        classes: propClasses,
        handleChangePassword,
        shouldShowNewPassword
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const maybeNewPasswordField = shouldShowNewPassword ? (
        <div className={classes.newPassword}>
            <Password
                fieldName="newPassword"
                label="New Password"
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, 8],
                    validatePassword,
                    [isNotEqualToField, 'password']
                ])}
                isToggleButtonHidden={false}
            />
        </div>
    ) : null;

    const maybeChangePasswordButton = !shouldShowNewPassword ? (
        <div className={classes.changePasswordButtonContainer}>
            <LinkButton
                classes={classes.changePasswordButton}
                type="button"
                onClick={handleChangePassword}
            >
                {'Change Password'}
            </LinkButton>
        </div>
    ) : null;

    const passwordLabel = shouldShowNewPassword
        ? 'Current Password'
        : 'Password';

    return (
        <Fragment>
            <div className={classes.root}>
                <div className={classes.firstname}>
                    <Field id="firstname" label="First Name">
                        <TextInput field="firstname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field id="lastname" label="Last Name">
                        <TextInput field="lastname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.email}>
                    <Field id="email" label="Email">
                        <TextInput field="email" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.password}>
                    <Password
                        fieldName="password"
                        label={passwordLabel}
                        validate={isRequired}
                        autoComplete="current-password"
                        isToggleButtonHidden={false}
                    />
                </div>
                {maybeNewPasswordField}
            </div>
            {maybeChangePasswordButton}
        </Fragment>
    );
};

export default EditForm;

EditForm.propTypes = {
    classes: shape({
        changePasswordButton: string,
        changePasswordButtonContainer: string,
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        buttons: string,
        passwordLabel: string,
        password: string,
        newPassword: string
    })
};
