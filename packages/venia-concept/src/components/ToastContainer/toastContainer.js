import React from 'react';
import { shape, string } from 'prop-types';
import { useToastStore } from '@magento/peregrine/src/Toasts/context';
import Toast from './toast';
import { mergeClasses } from 'src/classify';
import defaultClasses from './toastContainer.css';

const ToastContainer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const toasts = useToastStore();
    const toastList = Object.keys(toasts).map(toastKey => {
        const toast = toasts[toastKey];
        const toastProps = {
            id: toast.id,
            type: toast.type,
            icon: toast.icon,
            message: toast.message,
            actionText: toast.actionText,
            actionCallback: toast.actionCallback,
            dismissable: toast.dismissable
        };
        return <Toast key={toast.id} {...toastProps} />;
    });

    return (
        <div id="toast-root" className={classes.container}>
            {toastList}
        </div>
    );
};

ToastContainer.propTypes = {
    classes: shape({
        item: string,
        root: string
    })
};

export default ToastContainer;
