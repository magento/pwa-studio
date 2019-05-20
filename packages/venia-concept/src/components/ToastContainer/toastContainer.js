import React from 'react';
import { shape, string } from 'prop-types';
import { useToasts } from '@magento/peregrine';
import Toast from './toast';
import { mergeClasses } from 'src/classify';
import defaultClasses from './toastContainer.css';

const ToastContainer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ toasts }] = useToasts();
    // Given a map of toasts each with a property "timestamp", sort and display
    // based on the timestamp.
    const timestampMap = new Map();
    toasts.forEach(toast => {
        timestampMap[toast.timestamp] = toast;
    });

    const toastList = Object.keys(timestampMap)
        .sort()
        .map(timestamp => {
            const toast = timestampMap[timestamp];
            // Use a random key to trigger a recreation of this component if it
            // is a duplicate so that we can re-trigger the blink animation.
            const key = toast.isDuplicate ? Math.random() : toast.id;
            return <Toast key={key} {...toast} />;
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
