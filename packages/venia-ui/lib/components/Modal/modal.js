import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { node, object } from 'prop-types';

/**
 * A component that gives a modal-like behavior with content inside.
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

/**
 * Props for {@link Modal}
 *
 * @typedef props
 *
 * @property {ReactNodeLike} children any elements that will be child
 * elements inside the modal.
 * @property {Object} container the container element (a DOM element)
 * where the children will be rendered.
 */
Modal.propTypes = {
    children: node,
    container: object
};
