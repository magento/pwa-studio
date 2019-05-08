import React, { useCallback } from 'react';
import { func } from 'prop-types';
import defaultClasses from './toast.css';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';
import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';

const Toast = props => {
    const { id, type, icon, message, actionText, dismissable } = props;
    const classes = mergeClasses(defaultClasses, {});
    const { removeToast } = useToastActions();

    // TODO: Can these callbacks be defined within the addToast hook?
    const onDismiss = useCallback(() => {
        removeToast(id);
        props.onDismiss && props.onDismiss();
    });

    const onActionClick = useCallback(() => {
        removeToast(id);
        props.actionCallback && props.actionCallback();
    });

    return (
        <div className={classes.toast + ' ' + classes[type]}>
            {icon ? <Icon className={classes.icon} src={icon} /> : null}
            <div className={classes.message}>{message}</div>
            {dismissable ? (
                <div className={classes.controls}>
                    <button className={classes.dismiss} onClick={onDismiss}>
                        {'×'}
                    </button>
                </div>
            ) : null}
            {actionText ? (
                <div className={classes.actions}>
                    <button className={classes.action} onClick={onActionClick}>
                        {actionText}
                    </button>
                </div>
            ) : null}
        </div>
    );
};

Toast.propTypes = {
    // TODO: complete
    actionCallback: func,
    onDismiss: func
};

export default Toast;
