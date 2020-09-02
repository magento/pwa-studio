import React, { useCallback } from 'react';
import { object, shape, string, bool, array, func } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useEditModal } from '@magento/peregrine/lib/talons/AccountInformationPage/useEditModal';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import { Portal } from '../Portal';
import EditForm from './editForm';
import defaultClasses from './editModal.css';

const EditModal = props => {
    const {
        classes: propClasses,
        informationData,
        isDisabled,
        formErrors,
        activeChangePassword,
        handleChangePassword,
        handleSubmit
    } = props;
    const talonProps = useEditModal();
    const { handleClose, isOpen } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;

    const onCancelModal = useCallback(() => {
        handleClose();
        handleChangePassword(false);
    }, [handleClose, handleChangePassword]);

    // Unmount the form to force a reset back to original values on close
    const bodyElement = isOpen ? (
        <EditForm
            informationData={informationData}
            handleSubmit={handleSubmit}
            activeChangePassword={activeChangePassword}
            isDisabled={isDisabled}
            handleCancel={handleClose}
            handleChangePassword={handleChangePassword}
            formErrors={formErrors}
            onCancelModal={onCancelModal}
        />
    ) : null;

    return (
        <Portal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        {'Edit Account Information'}
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>{bodyElement}</div>
            </aside>
        </Portal>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        closeButton: string,
        body: string,
        header: string,
        headerText: string
    }),
    informationData: object,
    isDisabled: bool,
    formErrors: array,
    handleSubmit: func,
    handleChangePassword: func,
    activeChangePassword: bool
};
