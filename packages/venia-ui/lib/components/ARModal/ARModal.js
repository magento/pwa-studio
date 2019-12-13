import React, { useCallback, useState, useEffect } from 'react';
import { X as CloseIcon } from 'react-feather';

import Icon from '../Icon';
import { Modal } from '../Modal';
import { Video, ARScene, Sliders } from './ARViewer';

import filterModalClasses from './ARModal.css';

function ARModal({ show, handleClose }) {
    const [stream, setStream] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 10, z: 0 });
    const [rotation, setRotation] = useState([0, 0, 0]);
    const [element, setElement] = useState(null);

    const modalClass = show
        ? filterModalClasses.root_open
        : filterModalClasses.root;

    const closeModal = useCallback(() => {
        stream && stream.getTracks()[0].stop();
        setStream(null);
        handleClose();
    }, [stream, handleClose]);

    const handleXRotation = useCallback(
        (_, newValue) => {
            const xRotation = Number(newValue);
            if (xRotation) {
                setRotation([xRotation, rotation[1], rotation[2]]);
            }
        },
        [rotation, setRotation]
    );

    const handleYRotation = useCallback(
        (_, newValue) => {
            const yRotation = Number(newValue);
            if (yRotation) {
                setRotation([rotation[0], yRotation, rotation[2]]);
            }
        },
        [rotation, setRotation]
    );

    const handleZRotation = useCallback(
        (_, newValue) => {
            const zRotation = Number(newValue);
            if (zRotation) {
                setRotation([rotation[0], rotation[1], zRotation]);
            }
        },
        [rotation, setRotation]
    );

    useEffect(() => {
        if (show) {
            document.addEventListener('keypress', closeModal);
        }
        return () => {
            if (show) {
                document.removeEventListener('keypress', closeModal);
            }
        };
    }, [show, closeModal]);

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
                    <Video registerStream={setStream}>
                        <ARScene
                            setElement={setElement}
                            setPosition={setPosition}
                            setRotation={setRotation}
                            element={element}
                            rotation={rotation}
                            position={position}
                        />
                    </Video>
                    <Sliders
                        handleXRotation={handleXRotation}
                        handleYRotation={handleYRotation}
                        handleZRotation={handleZRotation}
                        element={element}
                    />
                </div>
            </aside>
        </Modal>
    ) : null;
}

export default ARModal;
