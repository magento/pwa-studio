import React from 'react';
import { shape, string, bool, array, func, object } from 'prop-types';

import { mergeClasses } from '../../classify';
import EditForm from './editForm';
import FormError from '../FormError';
import Dialog from '../Dialog';
import defaultClasses from './editModal.css';

const EditModal = props => {
    const {
        classes: propClasses,
        formErrors,
        handleCancel,
        handleSubmit,
        initialValues,
        isChangingPassword,
        isDisabled,
        isOpen,
        showChangePassword
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const dialogFormProps = { initialValues };

    return (
        <Dialog
            classes={{ body: classes.bodyEditAccountInformation }}
            confirmText={'Save'}
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={handleCancel}
            onConfirm={handleSubmit}
            shouldDisableAllButtons={isDisabled}
            shouldDisableConfirmButton={isDisabled}
            title={'Edit Account Information'}
        >
            <FormError
                classes={{ root: classes.errorContainer }}
                errors={formErrors}
            />
            <EditForm
                isChangingPassword={isChangingPassword}
                showChangePassword={showChangePassword}
            />
        </Dialog>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        errorContainer: string
    }),
    formErrors: array,
    handleCancel: func,
    handleSubmit: func,
    initialValues: object,
    isChangingPassword: bool,
    isDisabled: bool,
    isOpen: bool,
    onChangePassword: func
};
