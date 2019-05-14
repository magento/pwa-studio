import React, { useCallback } from 'react';
import { bool, func, number, oneOf, string } from 'prop-types';
import defaultClasses from './toast.css';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';
import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';

const Toast = props => {
    const { id, type, icon, message, actionText, dismissable } = props;
    const classes = mergeClasses(defaultClasses, {});
    const { removeToast } = useToastActions();

    // TODO: Can these callbacks be defined within the addToast hook?
    const handleDismiss = useCallback(() => {
        removeToast(id);
        props.onDismiss && props.onDismiss();
    });

    const handleAction = useCallback(() => {
        removeToast(id);
        props.actionCallback && props.actionCallback();
    });

    return (
        <div className={classes[`toast--${type}`]}>
            {icon ? (
                <Icon
                    className={classes[`icon--${type}`]}
                    src={icon}
                    attrs={{ width: 18 }}
                />
            ) : null}
            <div className={classes.message}>{message}</div>
            {dismissable ? (
                <div className={classes.controls}>
                    <button
                        className={classes.dismissButton}
                        onClick={handleDismiss}
                    >
                        {'×'}
                    </button>
                </div>
            ) : null}
            {actionText ? (
                <div className={classes.actions}>
                    <button
                        className={classes.actionButton}
                        onClick={handleAction}
                    >
                        {actionText}
                    </button>
                </div>
            ) : null}
        </div>
    );
};

Toast.propTypes = {
    actionCallback: func,
    actionText: string,
    dismissable: bool.isRequired,
    icon: func,
    id: number,
    message: string.isRequired,
    onDismiss: func,
    type: oneOf(['info', 'warning', 'error']).isRequired
};

export default Toast;
