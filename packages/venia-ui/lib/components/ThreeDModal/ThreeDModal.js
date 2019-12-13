import React, { useCallback } from 'react';
import { X as CloseIcon } from 'react-feather';
import { GLTFModel } from 'react-3d-viewer';

import Icon from '../Icon';
import { Modal } from '../Modal';

import threeDModalClasses from './ThreeDModal.css';

const modelPath = './venia-static/3d-models/Shades/Sunglasses_01.gltf';

function ThreeDModal({ show, handleClose }) {
    const modalClass = show
        ? threeDModalClasses.root_open
        : threeDModalClasses.root;

    const closeModal = useCallback(() => {
        handleClose();
    }, [handleClose]);

    return show ? (
        <Modal>
            <aside className={modalClass}>
                <div className={threeDModalClasses.body}>
                    <div className={threeDModalClasses.header}>
                        <h2 className={threeDModalClasses.headerTitle}>
                            {'3D View'}
                        </h2>
                        <button onClick={closeModal}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>
                    <div style={{ width: '100%', height: '100%' }}>
                        <GLTFModel
                            src={modelPath}
                            width={window.outerWidth}
                            height={window.outerHeight}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </aside>
        </Modal>
    ) : null;
}

export default ThreeDModal;
