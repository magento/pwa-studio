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

ToastContainer.propTypes = {
    classes: shape({
        item: string,
        root: string
    })
};

export default ToastContainer;
