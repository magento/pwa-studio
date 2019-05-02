import { createPortal } from 'react-dom';

const Modal = ({ children }) =>
    createPortal(children, document.getElementById('root'));

export default Modal;
