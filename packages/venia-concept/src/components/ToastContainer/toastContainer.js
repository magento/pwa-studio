import React from 'react';
import { shape, string } from 'prop-types';
import { useToastContext } from '@magento/peregrine';
import Toast from './toast';
import { mergeClasses } from 'src/classify';
import defaultClasses from './toastContainer.css';

const ToastContainer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ toasts }] = useToastContext();
    // Given a map of toasts each with a property "timestamp", sort and display
    // based on the timestamp.
    const timestampMap = {};
    Object.keys(toasts).forEach(toastKey => {
        const toast = toasts[toastKey];
        timestampMap[toast.timestamp] = toast;
    });

    const toastList = Object.keys(timestampMap)
        .sort()
        .map(timestamp => {
            const toast = timestampMap[timestamp];
            return <Toast key={toast.key} {...toast} />;
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
