import React, { Fragment } from 'react';
import { Form } from 'informed';
import { func, shape, string, bool, array } from 'prop-types';

import { mergeClasses } from '../../classify';
import Field from '../Field';
import FormError from '../FormError';
import Button from '../Button';
import TextInput from '../TextInput';
import LinkButton from '../LinkButton';
import Password from '../Password';
import combine from '../../util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword,
    validateDifferentCurrentPassword
} from '../../util/formValidators';
import defaultClasses from './editForm.css';

const EditForm = props => {
    const {
        classes: propClasses,
        handleSubmit,
        onCancelModal,
        handleChangePassword,
        informationData,
        activeChangePassword,
        isDisabled,
        formErrors
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const passwordArea = !activeChangePassword ? (
        <Fragment>
            <div className={classes.passwordLabel}>
                <Field id="password" label="Password">
                    <span>{'**********'}</span>
                </Field>
            </div>
            <div className={classes.changePasswordButtonContainer}>
                <LinkButton
                    classes={classes.changePasswordButton}
                    type="button"
                    onClick={() => handleChangePassword(true)}
                >
                    {'Change Password'}
                </LinkButton>
            </div>
        </Fragment>
    ) : (
        <Fragment>
            <div className={classes.password}>
                <Password
                    fieldName="password"
                    label="Current Password"
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <LinkButton
                    classes={classes.forgotPasswordButton}
                    type="button"
                >
                    {'Forgot Password?'}
                </LinkButton>
            </div>
            <div className={classes.newPassword}>
                <Password
                    fieldName="newPassword"
                    label="New Password"
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword,
                        validateDifferentCurrentPassword
                    ])}
                    isToggleButtonHidden={false}
                />
            </div>
        </Fragment>
    );

    return (
        <Fragment>
            <FormError errors={formErrors} />
            <Form
                className={classes.root}
                initialValues={informationData}
                onSubmit={handleSubmit}
            >
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
                {passwordArea}
                <div className={classes.buttons}>
                    <Button
                        disabled={isDisabled}
                        onClick={onCancelModal}
                        priority="low"
                    >
                        {'Cancel'}
                    </Button>
                    <Button disabled={isDisabled} type="submit" priority="high">
                        {isDisabled ? 'Saving' : 'Save'}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default EditForm;

EditForm.propTypes = {
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        buttons: string,
        passwordLabel: string,
        changePasswordButtonContainer: string,
        changePasswordButton: string,
        password: string,
        forgotPasswordButton: string,
        newPassword: string
    }),
    handleCancel: func,
    informationData: shape({
        email: string,
        firstname: string,
        lastname: string
    }),
    handleSubmit: func,
    handleChangePassword: func,
    activeChangePassword: bool,
    isDisabled: bool,
    formErrors: array
};
