import React from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import { Modal } from '../../Modal';
import EditForm, { modes as editFormModes } from './editForm';

import defaultClasses from './updateModal.css';

const UpdateModal = props => {
    const {
        handleCancel,
        handleSubmit,
        isOpen,
        pageIsUpdating,
        selectedShippingMethod,
        shippingMethods
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <Modal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        {'Edit Shipping Method'}
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleCancel}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>
                    <EditForm
                        handleCancel={handleCancel}
                        handleSubmit={handleSubmit}
                        mode={editFormModes.UPDATE}
                        pageIsUpdating={pageIsUpdating}
                        selectedShippingMethod={selectedShippingMethod}
                        shippingMethods={shippingMethods}
                    />
                </div>
            </aside>
        </Modal>
    );
};

export default UpdateModal;

UpdateModal.propTypes = {
    handleCancel: func,
    handleSubmit: func,
    isOpen: bool,
    pageIsUpdating: bool,
    selectedShippingMethod: string,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    )
};
