import React from 'react';
import { X as CloseIcon } from 'react-feather';

import Icon from '../Icon';
import { Modal } from '../Modal';

import filterModalClasses from './ARModal.css';

function ARModal({ show, handleClose }) {
    const modalClass = show
        ? filterModalClasses.root_open
        : filterModalClasses.root;

    return show ? (
        <Modal>
            <aside className={modalClass}>
                <div className={filterModalClasses.body}>
                    <div className={filterModalClasses.header}>
                        <h2 className={filterModalClasses.headerTitle}>
                            {'Hey There'}
                        </h2>
                        <button onClick={handleClose}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>
                </div>
            </aside>
        </Modal>
    ) : null;
}

export default ARModal;
