import React from 'react';
import { useIntl } from 'react-intl';
import { shape, string, bool, array, func, object } from 'prop-types';

import { useStyle } from '../../classify';
import EditForm from './editForm';
import FormError from '../FormError';
import Dialog from '../Dialog';
import defaultClasses from './editModal.css';

const EditModal = props => {
    const {
        classes: propClasses,
        formErrors,
        onCancel,
        onChangePassword,
        onSubmit,
        initialValues,
        isDisabled,
        isOpen,
        shouldShowNewPassword
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const dialogFormProps = { initialValues };

    return (
        <Dialog
            classes={{ body: classes.bodyEditAccountInformation }}
            confirmText={'Save'}
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onSubmit}
            shouldDisableAllButtons={isDisabled}
            shouldDisableConfirmButton={isDisabled}
            shouldUnmountOnHide={true}
            title={formatMessage({
                id: 'accountInformationPage.editAccount',
                defaultMessage: 'Edit Account Information'
            })}
        >
            <FormError
                classes={{ root: classes.errorContainer }}
                errors={formErrors}
            />
            <EditForm
                handleChangePassword={onChangePassword}
                shouldShowNewPassword={shouldShowNewPassword}
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
    isDisabled: bool,
    isOpen: bool
};
