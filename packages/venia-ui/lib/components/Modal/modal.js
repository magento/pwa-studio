import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { node, object } from 'prop-types';

/**
 * A container that gives a modal-like behaviour with content inside.
 *
 * @typedef Modal
 * @kind functional component
 *
 * @param {children} children React child elements
 * @param {container} container modal container
 *
 * @returns {React.ReactPortal} A React portal that displays some content as a modal.
 */
const Modal = ({ children, container }) => {
    const target = useMemo(
        () =>
            container instanceof HTMLElement
                ? container
                : document.getElementById('root'),
        [container]
    );

    return createPortal(children, target);
};

export default Modal;

Modal.propTypes = {
    children: node,
    container: object
};
