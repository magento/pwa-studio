import React from 'react';
import { shape, string } from 'prop-types';
import { useToasts } from '@magento/peregrine';
import Toast from './toast';
import { useStyle } from '../../classify';
import defaultClasses from './toastContainer.module.css';

/**
 * A container for toast notifications.
 *
 * This component must be a child, nested or otherwise, of a
 * ToastContextProvider component.
 *
 * @typedef ToastContainer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays toast notification data.
 */
const ToastContainer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [{ toasts }] = useToasts();

    // Given a map of toasts each with a property "timestamp", sort and display
    // based on the timestamp.
    const sortByTimestamp = ([, toastA], [, toastB]) =>
        toastA.timestamp - toastB.timestamp;

    const toastElements = Array.from(toasts)
        .sort(sortByTimestamp)
        .map(([id, toast]) => {
            const key = toast.isDuplicate ? Math.random() : id;

            return <Toast key={key} {...toast} />;
        });

    return (
        <div id="toast-root" className={classes.root}>
            {toastElements}
        </div>
    );
};

/**
 * Props for {@link ToastContainer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 *   ToastContainer and its Toast components
 * @property {String} classes.root CSS classes for the root container
 */
ToastContainer.propTypes = {
    classes: shape({
        root: string
    })
};

export default ToastContainer;
