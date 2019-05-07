import { useMemo } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ parentId, children }) => {
    const getPortalParent = useMemo(
        () => document.getElementById(`${parentId || 'root'}`),
        [id]
    );

    return createPortal(children, getPortalParent);
};

export default Modal;
