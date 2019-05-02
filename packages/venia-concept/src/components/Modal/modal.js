import { createPortal } from 'react-dom';

const Modal = ({ children }) => createPortal(children, document.body);

export default Modal;
