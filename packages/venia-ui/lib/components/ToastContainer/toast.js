import React from 'react';
import { bool, func, number, object, oneOf, string } from 'prop-types';
import defaultClasses from './toast.css';
import { useStyle } from '../../classify';
import Icon from '../Icon';

import { X as CloseIcon } from 'react-feather';

const Toast = props => {
    const {
        actionText,
        dismissable,
        icon,
        message,
        onAction,
        handleAction,
        onDismiss,
        handleDismiss,
        type
    } = props;

    const classes = useStyle(defaultClasses, {});

    const iconElement = icon ? <>{icon}</> : null;

    const controls =
        onDismiss || dismissable ? (
            <button className={classes.dismissButton} onClick={handleDismiss}>
                <Icon src={CloseIcon} attrs={{ width: 14 }} />
            </button>
        ) : null;

    const actions = onAction ? (
        <div className={classes.actions}>
            <button className={classes.actionButton} onClick={handleAction}>
                {actionText}
            </button>
        </div>
    ) : null;

    return (
        <div className={classes[`${type}Toast`]}>
            <span className={classes.icon}>{iconElement}</span>
            <div className={classes.message}>{message}</div>
            <div className={classes.controls}>{controls}</div>
            {actions}
        </div>
    );
};

Toast.propTypes = {
    actionText: string,
    dismissable: bool,
    icon: object,
    id: number,
    message: string.isRequired,
    onAction: func,
    onDismiss: func,
    handleAction: func,
    handleDismiss: func,
    type: oneOf(['info', 'warning', 'error', 'success']).isRequired
};

export default Toast;
