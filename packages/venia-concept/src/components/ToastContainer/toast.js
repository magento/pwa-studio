import React from 'react';
import { bool, func, number, oneOf, string } from 'prop-types';
import defaultClasses from './toast.css';
import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';
import CloseIcon from 'react-feather/dist/icons/x';

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

    const classes = mergeClasses(defaultClasses, {});

    return (
        <div className={classes[`${type}Toast`]}>
            {icon ? (
                <Icon
                    className={classes.icon}
                    src={icon}
                    attrs={{ width: 18 }}
                />
            ) : null}
            <div className={classes.message}>{message}</div>
            {onDismiss || dismissable ? (
                <div className={classes.controls}>
                    <button
                        className={classes.dismissButton}
                        onClick={handleDismiss}
                    >
                        <Icon src={CloseIcon} attrs={{ width: 14 }} />
                    </button>
                </div>
            ) : null}
            {onAction ? (
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
    actionText: string,
    dismissable: bool,
    icon: func,
    id: number,
    message: string.isRequired,
    onAction: func,
    onDismiss: func,
    handleAction: func,
    handleDismiss: func,
    type: oneOf(['info', 'warning', 'error']).isRequired
};

export default Toast;
