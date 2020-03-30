import React from 'react';
import { X as CloseIcon } from 'react-feather';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import { Modal } from '../../Modal';
import EditForm, { modes as editFormModes } from './editForm';

import defaultClasses from './updateModal.css';

const UpdateModal = props => {
    const {
        handleCancelUpdate,
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
                        onClick={handleCancelUpdate}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>
                    <EditForm
                        handleCancelUpdate={handleCancelUpdate}
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
