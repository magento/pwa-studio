import React from 'react';
import { object, shape, string, bool, array, func } from 'prop-types';

import { mergeClasses } from '../../classify';
import EditForm from './editForm';
import FormError from '../FormError';
import Dialog from '../Dialog';
import defaultClasses from './editModal.css';

const EditModal = props => {
    const {
        classes: propClasses,
        informationData,
        isDisabled,
        formErrors,
        activeChangePassword,
        handleActivePassword,
        handleSubmit,
        isOpen,
        handleCancel
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const dialogFormProps = {
        initialValues: informationData
    };

    return (
        <Dialog
            confirmText={'Save'}
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={handleCancel}
            onConfirm={handleSubmit}
            shouldDisableAllButtons={isDisabled}
            shouldDisableConfirmButton={isDisabled}
            title={'Edit Account Information'}
            classes={{ body: classes.bodyEditAccountInformation }}
        >
            <FormError
                errors={formErrors}
                classes={{ root: classes.errorContainer }}
            />
            <EditForm
                informationData={informationData}
                activeChangePassword={activeChangePassword}
                isDisabled={isDisabled}
                handleActivePassword={handleActivePassword}
            />
        </Dialog>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        errorContainer: string
    }),
    informationData: object,
    isDisabled: bool,
    formErrors: array,
    activeChangePassword: bool,
    isOpen: bool,
    handleActivePassword: func,
    handleSubmit: func,
    handleCancel: func
};
