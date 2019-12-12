import React, { useCallback, useState } from 'react';
import { X as CloseIcon } from 'react-feather';

import Icon from '../Icon';
import { Modal } from '../Modal';
import { Video, ARScene } from './ARViewer';

import filterModalClasses from './ARModal.css';

function ARModal({ show, handleClose }) {
    const [stream, setStream] = useState(null);

    const modalClass = show
        ? filterModalClasses.root_open
        : filterModalClasses.root;

    const closeModal = useCallback(() => {
        stream && stream.getTracks()[0].stop();
        setStream(null);
        handleClose();
    }, [stream, handleClose]);

    return show ? (
        <Modal>
            <aside className={modalClass}>
                <div className={filterModalClasses.body}>
                    <div className={filterModalClasses.header}>
                        <h2 className={filterModalClasses.headerTitle}>
                            {'AR View'}
                        </h2>
                        <button onClick={closeModal}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>
                    <Video registerStream={setStream} />
                    <ARScene />
                </div>
            </aside>
        </Modal>
    ) : null;
}

export default ARModal;
