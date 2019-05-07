import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { node, object } from 'prop-types';

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
