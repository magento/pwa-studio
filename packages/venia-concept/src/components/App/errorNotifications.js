import React, { Component } from 'react';
import { arrayOf, object, func, shape, string } from 'prop-types';
import classify from 'src/classify';
import { Notification, NotificationStack } from 'src/components/Notifications';
import defaultClasses from './errorNotifications.css';

const dismissers = new WeakMap();

class ErrorNotifications extends Component {
    static propTypes = {
        classes: shape({
            debuginfo: string
        }).isRequired,
        errors: arrayOf(
            shape({
                error: object.isRequired,
                id: string.isRequired,
                loc: string
            })
        ),
        onDismissError: func.isRequired
    };

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    dismissNotificationOnClick(e, dismiss) {
        e.preventDefault();
        e.stopPropagation();
        dismiss();
    }

    // Memoize dismisser funcs to reduce re-renders from func identity change.
    getErrorDismisser(error) {
        const { onDismissError } = this.props;
        return dismissers.has(error)
            ? dismissers.get(error)
            : dismissers.set(error, () => onDismissError(error)).get(error);
    }

    get allNotifications() {
        const { classes, errors } = this.props;
        return errors.map(({ error, id, loc }) => (
            <Notification
                key={id}
                type="error"
                onClick={this.dismissNotificationOnClick}
                afterDismiss={this.getErrorDismisser(error)}
            >
                <div>Sorry! An unexpected error occurred.</div>
                <small className={classes.debuginfo}>
                    Debug: {id} {loc}
                </small>
            </Notification>
        ));
    }

    render() {
        const { classes, errors } = this.props;
        if (errors.length > 0) {
            return (
                <div className={classes.root}>
                    <NotificationStack>
                        {this.allNotifications}
                    </NotificationStack>
                </div>
            );
        }
        return null;
    }
}

export default classify(defaultClasses)(ErrorNotifications);
