import React from 'react';
import defaultClasses from './toast.css';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';
import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';

const Toast = ({
    id,
    type,
    icon,
    message,
    actionText,
    actionCallback,
    dismissable
}) => {
    const classes = mergeClasses(defaultClasses, {});
    const { removeToast } = useToastActions();

    return (
        <div className={classes.toast + ' ' + classes[type]}>
            {icon ? <Icon className={classes.icon} src={icon} /> : null}
            <div className={classes.message}>{message}</div>
            {dismissable ? (
                <div className={classes.controls}>
                    <button
                        className={classes.dismiss}
                        onClick={() => removeToast(id)}
                    >
                        {'×'}
                    </button>
                </div>
            ) : null}
            {actionText ? (
                <div className={classes.actions}>
                    <button
                        className={classes.action}
                        onClick={() => {
                            removeToast(id);
                            actionCallback();
                        }}
                    >
                        {actionText}
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default Toast;
